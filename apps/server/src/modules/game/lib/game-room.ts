import type {
  GameAction,
  GameErrorCode,
  LobbyTable,
  PlayerView,
  PublicProfile,
  QuickPhraseId,
  TablePhrase,
  TablePlayer,
  TableSettings,
  TableStatus,
  TauntId
} from '@durak-master/schemas';

import { Logger } from '@nestjs/common';
import { randomInt, randomUUID } from 'node:crypto';

import type { GameSession } from './game-session';

import { createGameSession } from './game-session';
import { nextFreeSeat } from './next-free-seat';
import { RoomChatter } from './room-chatter';
import { RoomTimers } from './room-timers';

export type RoomMember = {
  profile: PublicProfile;
  seat: number;
  isReady: boolean;
  isBot: boolean;
  isConnected: boolean;
};

export type RoomEvent =
  | { type: 'emoji'; userId: string; emoji: TauntId }
  | { type: 'finished'; loserUserId: string | null; isDraw: boolean }
  | { type: 'phrase'; phrase: TablePhrase }
  | { type: 'state-changed' };

export class GameRoom {
  readonly id: string;
  readonly createdAt = Date.now();

  private readonly logger = new Logger(GameRoom.name);
  private members = new Map<string, RoomMember>();
  private session: GameSession | null = null;
  private status: TableStatus = 'waiting';

  private hasDealt = false;
  private readonly chatter = new RoomChatter();

  private readonly timers = new RoomTimers({
    onTurnTimeout: () => this.handleTurnTimeout(),
    onBotTurn: () => this.handleBotTurn()
  });

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

  get isInMatch(): boolean {
    return this.isPlaying || this.hasDealt;
  }

  get isPlaying(): boolean {
    return this.status === 'playing';
  }

  join(profile: PublicProfile, isBot = false): RoomMember | null {
    if (this.isFull || this.status !== 'waiting') {
      return null;
    }

    const member: RoomMember = {
      profile,
      seat: nextFreeSeat(this.getMembers().map((item) => item.seat)),
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

      this.session?.markDisconnected(userId, true);

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

    this.session?.markDisconnected(userId, false);

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

    members.forEach((member, index) => {
      member.seat = index;
    });

    this.status = 'playing';
    this.hasDealt = true;
    this.session = createGameSession({
      tableId: this.id,
      settings: this.settings,
      userIds: members.map((member) => member.profile.userId),
      randomInt: (maxExclusive) => randomInt(maxExclusive)
    });

    this.scheduleTurnTimer();
    this.scheduleBotTurn();
    this.emit({ type: 'state-changed' });
  }

  applyAction(userId: string, action: GameAction, expectedVersion: number): GameErrorCode | null {
    if (!this.session || this.status !== 'playing') {
      return 'GAME_NOT_ACTIVE';
    }

    if (expectedVersion !== this.session.state.version) {
      return 'VERSION_MISMATCH';
    }

    const error = this.session.apply(userId, action);

    if (error) {
      return error;
    }

    this.afterStateChange();

    return null;
  }

  private afterStateChange(): void {
    if (!this.session) {
      return;
    }

    if (this.session.state.phase === 'finished') {
      const outcome = this.session.getOutcome();

      this.clearTimers();

      this.emit({
        type: 'finished',
        loserUserId: outcome.loserUserId,
        isDraw: outcome.isDraw
      });

      this.status = 'waiting';
      this.session = null;

      for (const member of this.members.values()) {
        member.isReady = member.isBot;
      }

      this.emit({ type: 'state-changed' });

      return;
    }

    this.scheduleTurnTimer();
    this.scheduleBotTurn();
    this.emit({ type: 'state-changed' });
  }

  private scheduleTurnTimer(): void {
    this.timers.clearTurn();

    if (!this.session || this.session.state.phase === 'finished') {
      return;
    }

    const activeMember = this.getActiveMember();

    if (!activeMember || activeMember.isBot) {
      return;
    }

    const timeoutMs = this.settings.turnTimeoutSeconds * 1000;

    this.session.setTurnDeadline(Date.now() + timeoutMs);
    this.timers.scheduleTurn(timeoutMs);
  }

  private handleTurnTimeout(): void {
    if (!this.session || this.status !== 'playing') {
      return;
    }

    const activeMember = this.getActiveMember();

    if (!activeMember) {
      return;
    }

    if (this.session.applyTimeout(activeMember.profile.userId)) {
      this.afterStateChange();
    }
  }

  private scheduleBotTurn(): void {
    this.timers.clearBot();

    if (!this.session || this.session.state.phase === 'finished') {
      return;
    }

    if (!this.getActiveMember()?.isBot) {
      return;
    }

    this.timers.scheduleBot();
  }

  private handleBotTurn(): void {
    const activeMember = this.getActiveMember();

    if (!this.session || this.status !== 'playing' || !activeMember) {
      return;
    }

    const userId = activeMember.profile.userId;

    if (this.session.applyBotTurn(userId)) {
      this.afterStateChange();

      return;
    }

    this.logger.warn(`Bot turn produced no legal action in room ${this.id}`);

    if (this.session.applyTimeout(userId)) {
      this.afterStateChange();

      return;
    }

    this.logger.error(`Bot ${userId} is stuck in room ${this.id}`);
  }

  private getActiveMember(): RoomMember | undefined {
    const activeSeat = this.session?.state.activeSeat;

    return this.getMembers().find((member) => member.seat === activeSeat);
  }

  sendPhrase(userId: string, phraseId: QuickPhraseId): TablePhrase | null {
    const member = this.members.get(userId);

    if (!member) {
      return null;
    }

    const phrase = this.chatter.add(userId, phraseId);

    this.emit({ type: 'phrase', phrase });

    return phrase;
  }

  sendEmoji(userId: string, emoji: TauntId): void {
    if (!this.members.has(userId)) {
      return;
    }

    this.emit({ type: 'emoji', userId, emoji });
  }

  getViewFor(userId: string): PlayerView | null {
    return this.session?.getViewFor(userId) ?? null;
  }

  updateProfile(userId: string, patch: Pick<PublicProfile, 'avatarUrl' | 'name'>): boolean {
    const member = this.members.get(userId);

    if (!member) {
      return false;
    }

    member.profile = { ...member.profile, ...patch };

    return true;
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
    this.timers.clearAll();
  }
}
