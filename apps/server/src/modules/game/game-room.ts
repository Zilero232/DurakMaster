import type {
  GameAction,
  GameState,
  LobbyTable,
  PublicProfile,
  QuickPhraseId,
  TablePhrase,
  TablePlayer,
  TableSettings,
  TableStatus
} from '@durak-master/schemas';

import {
  createGame,
  decideBotAction,
  decideTimeoutAction,
  reduce,
  toPlayerView
} from '@durak-master/game-core';
import { randomInt, randomUUID } from 'node:crypto';

export type RoomMember = {
  profile: PublicProfile;
  seat: number;
  isReady: boolean;
  isBot: boolean;
  isConnected: boolean;
};

export type RoomEvent =
  | { type: 'emoji'; userId: string; emoji: string }
  | { type: 'finished'; loserUserId: string | null; isDraw: boolean }
  | { type: 'phrase'; phrase: TablePhrase }
  | { type: 'state-changed' };

export class GameRoom {
  readonly id: string;
  readonly createdAt = Date.now();

  private members = new Map<string, RoomMember>();
  private state: GameState | null = null;
  private status: TableStatus = 'waiting';
  private turnTimer: NodeJS.Timeout | null = null;
  private botTimer: NodeJS.Timeout | null = null;
  private phrases: TablePhrase[] = [];

  constructor(
    readonly settings: TableSettings,
    readonly passwordHash: string | null,
    private readonly emit: (event: RoomEvent) => void
  ) {
    this.id = randomUUID();
  }

  getMembers(): RoomMember[] {
    return [...this.members.values()].sort((a, b) => a.seat - b.seat);
  }

  getMember(userId: string): RoomMember | undefined {
    return this.members.get(userId);
  }

  get memberCount(): number {
    return this.members.size;
  }

  get isFull(): boolean {
    return this.members.size >= this.settings.maxPlayers;
  }

  get isPlaying(): boolean {
    return this.status === 'playing';
  }

  join(profile: PublicProfile, isBot = false): RoomMember | null {
    if (this.isFull || this.status !== 'waiting') {
      return null;
    }

    const taken = new Set([...this.members.values()].map((member) => member.seat));
    let seat = 0;

    while (taken.has(seat)) {
      seat += 1;
    }

    const member: RoomMember = {
      profile,
      seat,
      isReady: isBot,
      isBot,
      isConnected: true
    };

    this.members.set(profile.userId, member);
    this.emit({ type: 'state-changed' });

    return member;
  }

  leave(userId: string): void {
    const member = this.members.get(userId);

    if (!member) {
      return;
    }

    if (this.status === 'playing') {
      member.isConnected = false;

      if (this.state) {
        this.state = {
          ...this.state,
          players: this.state.players.map((player) =>
            player.userId === userId ? { ...player, isDisconnected: true } : player
          )
        };
      }

      this.emit({ type: 'state-changed' });

      return;
    }

    this.members.delete(userId);
    this.emit({ type: 'state-changed' });
  }

  reconnect(userId: string): boolean {
    const member = this.members.get(userId);

    if (!member) {
      return false;
    }

    member.isConnected = true;

    if (this.state) {
      this.state = {
        ...this.state,
        players: this.state.players.map((player) =>
          player.userId === userId ? { ...player, isDisconnected: false } : player
        )
      };
    }

    this.emit({ type: 'state-changed' });

    return true;
  }

  setReady(userId: string, isReady: boolean): void {
    const member = this.members.get(userId);

    if (!member || this.status !== 'waiting') {
      return;
    }

    member.isReady = isReady;
    this.emit({ type: 'state-changed' });

    if (this.canStart()) {
      this.start();
    }
  }

  private canStart(): boolean {
    return (
      this.status === 'waiting' &&
      this.members.size >= 2 &&
      [...this.members.values()].every((member) => member.isReady)
    );
  }

  start(): void {
    if (this.status === 'playing') {
      return;
    }

    const members = this.getMembers();

    this.status = 'playing';
    this.state = createGame({
      tableId: this.id,
      settings: this.settings,
      userIds: members.map((member) => member.profile.userId),
      randomInt: (maxExclusive) => randomInt(maxExclusive)
    });

    this.scheduleTurnTimer();
    this.scheduleBotTurn();
    this.emit({ type: 'state-changed' });
  }

  applyAction(userId: string, action: GameAction, expectedVersion: number): string | null {
    if (!this.state || this.status !== 'playing') {
      return 'GAME_NOT_ACTIVE';
    }

    if (expectedVersion !== this.state.version) {
      return 'VERSION_MISMATCH';
    }

    const result = reduce(this.state, userId, action);

    if (!result.ok) {
      return result.error;
    }

    this.state = result.state;
    this.afterStateChange();

    return null;
  }

  private afterStateChange(): void {
    if (!this.state) {
      return;
    }

    if (this.state.phase === 'finished') {
      this.status = 'finished';
      this.clearTimers();
      this.emit({ type: 'state-changed' });
      this.emit({
        type: 'finished',
        loserUserId: this.state.loserUserId,
        isDraw: this.state.isDraw
      });

      return;
    }

    this.scheduleTurnTimer();
    this.scheduleBotTurn();
    this.emit({ type: 'state-changed' });
  }

  private scheduleTurnTimer(): void {
    if (this.turnTimer) {
      clearTimeout(this.turnTimer);
      this.turnTimer = null;
    }

    if (!this.state || this.state.phase === 'finished') {
      return;
    }

    const activeMember = this.getMembers().find((member) => member.seat === this.state?.activeSeat);

    if (!activeMember || activeMember.isBot) {
      return;
    }

    const timeoutMs = this.settings.turnTimeoutSeconds * 1000;

    this.state = { ...this.state, turnDeadline: Date.now() + timeoutMs };

    this.turnTimer = setTimeout(() => this.handleTurnTimeout(), timeoutMs);
  }

  private handleTurnTimeout(): void {
    if (!this.state || this.status !== 'playing') {
      return;
    }

    const activeMember = this.getMembers().find((member) => member.seat === this.state?.activeSeat);

    if (!activeMember) {
      return;
    }

    const action = decideTimeoutAction(this.state, activeMember.profile.userId);
    const result = reduce(this.state, activeMember.profile.userId, action);

    if (result.ok) {
      this.state = result.state;
      this.afterStateChange();
    }
  }

  private scheduleBotTurn(): void {
    if (this.botTimer) {
      clearTimeout(this.botTimer);
      this.botTimer = null;
    }

    if (!this.state || this.state.phase === 'finished') {
      return;
    }

    const activeMember = this.getMembers().find((member) => member.seat === this.state?.activeSeat);

    if (!activeMember?.isBot) {
      return;
    }

    this.botTimer = setTimeout(() => {
      if (!this.state || this.status !== 'playing') {
        return;
      }

      const userId = activeMember.profile.userId;
      const action = decideBotAction(this.state, userId);
      const result = reduce(this.state, userId, action);

      if (result.ok) {
        this.state = result.state;
        this.afterStateChange();

        return;
      }

      const fallback = reduce(this.state, userId, { type: 'pass' });

      if (fallback.ok) {
        this.state = fallback.state;
        this.afterStateChange();
      }
    }, 700);
  }

  sendPhrase(userId: string, phraseId: QuickPhraseId): TablePhrase | null {
    const member = this.members.get(userId);

    if (!member) {
      return null;
    }

    const phrase: TablePhrase = {
      id: randomUUID(),
      userId,
      phraseId,
      sentAt: Date.now()
    };

    this.phrases = [...this.phrases.slice(-19), phrase];
    this.emit({ type: 'phrase', phrase });

    return phrase;
  }

  sendEmoji(userId: string, emoji: string): void {
    if (!this.members.has(userId)) {
      return;
    }

    this.emit({ type: 'emoji', userId, emoji });
  }

  getViewFor(userId: string) {
    if (!this.state) {
      return null;
    }

    return toPlayerView(this.state, userId);
  }

  getProfiles(): PublicProfile[] {
    return this.getMembers().map((member) => member.profile);
  }

  toLobbyTable(): LobbyTable {
    const players: TablePlayer[] = this.getMembers().map((member) => ({
      userId: member.profile.userId,
      name: member.profile.name,
      avatarUrl: member.profile.avatarUrl,
      rating: member.profile.rating,
      seat: member.seat,
      isReady: member.isReady
    }));

    return {
      id: this.id,
      status: this.status,
      settings: this.settings,
      players,
      hasPremiumPlayer: this.getMembers().some((member) => member.profile.isPremium),
      createdAt: this.createdAt
    };
  }

  clearTimers(): void {
    if (this.turnTimer) {
      clearTimeout(this.turnTimer);
      this.turnTimer = null;
    }

    if (this.botTimer) {
      clearTimeout(this.botTimer);
      this.botTimer = null;
    }
  }
}
