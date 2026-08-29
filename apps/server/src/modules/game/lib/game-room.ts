import type {
  Card,
  GameAction,
  GameCoreState,
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

import { getGameModule } from '@durak-master/game-core';
import { Logger } from '@nestjs/common';
import { randomInt, randomUUID } from 'node:crypto';

import type { GameSession } from './game-session';

import { isVisibleBotAction, MISSED_TURNS_LIMIT } from '../config';
import { createGameSession } from './game-session';
import { nextFreeSeat } from './next-free-seat';
import { RoomChatter } from './room-chatter';
import { RoomTimers } from './room-timers';

const collectOutPlaces = (players: GameCoreState['players']): Record<string, number> => {
  const places: Record<string, number> = {};

  for (const player of players) {
    if (player.outPlace !== null) {
      places[player.userId] = player.outPlace;
    }
  }

  return places;
};

export type RoomMember = {
  profile: PublicProfile;
  seat: number;
  isReady: boolean;
  isBot: boolean;
  isConnected: boolean;
  missedTurns: number;
};

export type RoomEvent =
  | { type: 'emoji'; userId: string; emoji: TauntId }
  | {
      type: 'finished';
      loserUserId: string | null;
      isDraw: boolean;
      members: RoomMember[];
      outPlaces: Record<string, number>;
    }
  | { type: 'phrase'; phrase: TablePhrase }
  | { type: 'state-changed' };

export class GameRoom {
  readonly id: string;
  readonly createdAt = Date.now();

  private readonly logger = new Logger(GameRoom.name);
  private members = new Map<string, RoomMember>();
  private ownerId: string | null = null;
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

  get isAbandoned(): boolean {
    return ![...this.members.values()].some((member) => !member.isBot);
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
      isConnected: true,
      missedTurns: 0
    };

    this.members.set(profile.userId, member);

    if (!isBot) {
      this.ownerId ??= profile.userId;
    }

    this.emit({ type: 'state-changed' });

    return member;
  }

  leave(userId: string): void {
    const member = this.members.get(userId);

    if (!member) {
      return;
    }

    if (this.status === 'playing') {
      this.forfeit(userId);

      return;
    }

    this.members.delete(userId);
    this.passOwnership(userId);
    this.emit({ type: 'state-changed' });
  }

  private passOwnership(leavingUserId: string): void {
    if (this.ownerId !== leavingUserId) {
      return;
    }

    const next = this.getMembers().find((member) => !member.isBot);

    this.ownerId = next?.profile.userId ?? null;
  }

  suspend(userId: string): void {
    const member = this.members.get(userId);

    if (!member) {
      return;
    }

    member.isConnected = false;
    this.session?.markDisconnected(userId, true);
    this.emit({ type: 'state-changed' });
  }

  private forfeit(userId: string): void {
    const played = this.getMembers();

    this.members.delete(userId);
    this.passOwnership(userId);
    this.clearTimers();

    this.status = 'waiting';
    this.session = null;

    for (const member of this.members.values()) {
      member.isReady = member.isBot;
    }

    this.emit({
      type: 'finished',
      loserUserId: userId,
      isDraw: false,
      members: played,
      outPlaces: {}
    });
  }

  reconnect(userId: string): boolean {
    const member = this.members.get(userId);

    if (!member) {
      return false;
    }

    member.isConnected = true;
    member.missedTurns = 0;

    this.session?.markDisconnected(userId, false);

    if (this.isPlaying && this.getActiveMember()?.profile.userId === userId) {
      this.scheduleTurnTimer();
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
    const { minPlayers } = getGameModule(this.settings.game);
    const required = Math.max(minPlayers, this.settings.maxPlayers);

    return (
      this.status === 'waiting' &&
      this.members.size >= required &&
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

  private afterStateChange(wasVisible = true): void {
    if (!this.session) {
      return;
    }

    if (this.session.state.phase === 'finished') {
      const outcome = this.session.getOutcome();
      const played = this.getMembers();
      const outPlaces = collectOutPlaces(this.session.state.players);

      this.clearTimers();

      this.status = 'waiting';
      this.session = null;

      for (const member of this.members.values()) {
        member.isReady = member.isBot;
      }

      this.emit({
        type: 'finished',
        loserUserId: outcome.loserUserId,
        isDraw: outcome.isDraw,
        members: played,
        outPlaces
      });

      return;
    }

    this.scheduleTurnTimer();
    this.scheduleBotTurn(wasVisible);
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

    activeMember.missedTurns += 1;

    if (activeMember.isBot) {
      if (this.session.applyTimeout(activeMember.profile.userId)) {
        this.afterStateChange();
      }

      return;
    }

    if (activeMember.missedTurns >= MISSED_TURNS_LIMIT) {
      this.forfeit(activeMember.profile.userId);

      return;
    }

    if (this.session.applyTimeout(activeMember.profile.userId)) {
      this.afterStateChange();
    }
  }

  private scheduleBotTurn(wasVisible = true): void {
    this.timers.clearBot();

    if (!this.session || this.session.state.phase === 'finished') {
      return;
    }

    if (!this.nextBot()) {
      return;
    }

    this.timers.scheduleBot(wasVisible, this.botDelayScale());
  }

  private nextBot(): RoomMember | undefined {
    const session = this.session;

    if (!session) {
      return undefined;
    }

    const active = this.getActiveMember();

    if (active?.isBot && session.hasPendingMove(active.profile.userId)) {
      return active;
    }

    return this.getMembers().find(
      (member) => member.isBot && session.hasPendingMove(member.profile.userId)
    );
  }

  private botDelayScale(): number {
    return this.settings.speed === 'fast' ? 0.6 : 1;
  }

  private handleBotTurn(): void {
    const bot = this.nextBot();

    if (!this.session || this.status !== 'playing' || !bot) {
      return;
    }

    const userId = bot.profile.userId;
    const botAction = this.session.applyBotTurn(userId);

    if (botAction !== null) {
      this.afterStateChange(isVisibleBotAction(botAction));

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

  undoLastMove(userId: string): boolean {
    if (!this.session || this.status !== 'playing') {
      return false;
    }

    if (!this.session.undoLast(userId)) {
      return false;
    }

    this.scheduleTurnTimer();
    this.scheduleBotTurn();

    return true;
  }

  peekTalon(): Card[] | null {
    const state = this.session?.state;

    return state && 'talon' in state ? [...(state.talon as Card[])] : null;
  }

  peekHand(userId: string): Card[] | null {
    const state = this.session?.state;

    if (!state || !('hands' in state)) {
      return null;
    }

    const hands = state.hands as Record<string, Card[]>;

    return hands[userId] ? [...hands[userId]] : null;
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
      ownerId: this.ownerId,
      hasPremiumPlayer: this.getMembers().some((member) => member.profile.isPremium),
      createdAt: this.createdAt
    };
  }

  clearTimers(): void {
    this.timers.clearAll();
  }
}
