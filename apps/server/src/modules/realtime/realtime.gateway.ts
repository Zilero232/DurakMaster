import type {
  ClientMessage,
  CreateTableInput,
  GameAction,
  GameErrorCode,
  JoinTableInput,
  ServerMessage
} from '@durak-master/schemas';
import type { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import type { WebSocket } from 'ws';

import { clientMessageSchema, computeRatingGain, INVITE_TTL_MS } from '@durak-master/schemas';
import { Logger } from '@nestjs/common';
import { WebSocketGateway } from '@nestjs/websockets';
import { RateLimiterMemory } from 'rate-limiter-flexible';

import type { FinishedPlayer } from '../game/game-history.service';
import type { RoomEvent } from '../game/game-room';

import { AuthService } from '../../lib/auth/auth.service';
import { isDevelopment } from '../../lib/env';
import { GameHistoryService } from '../game/game-history.service';
import { RoomsService } from '../game/rooms.service';
import { hashTablePassword, verifyTablePassword } from '../game/table-password';
import { ProfilesService } from '../profile/profiles.service';
import { AchievementsService } from '../social/achievements.service';
import { FriendsService } from '../social/friends.service';
import { LeaderboardService } from '../social/leaderboard.service';
import { SessionsService } from './sessions.service';

type Socket = WebSocket & { userId?: string; isAlive?: boolean };

@WebSocketGateway({ path: '/ws' })
export class RealtimeGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(RealtimeGateway.name);

  private readonly sockets = new Map<string, Socket>();
  private readonly lobbySubscribers = new Set<string>();

  private readonly rateLimiter = new RateLimiterMemory({
    points: 25,
    duration: 5
  });

  constructor(
    private readonly rooms: RoomsService,
    private readonly sessions: SessionsService,
    private readonly auth: AuthService,
    private readonly profiles: ProfilesService,
    private readonly friends: FriendsService,
    private readonly achievements: AchievementsService,
    private readonly leaderboard: LeaderboardService,
    private readonly history: GameHistoryService
  ) {}

  private toHeaders(request: {
    url?: string;
    headers: Record<string, string | string[] | undefined>;
  }): Headers {
    const headers = new Headers();

    for (const [key, value] of Object.entries(request.headers)) {
      if (typeof value === 'string') {
        headers.set(key, value);
      } else if (Array.isArray(value)) {
        headers.set(key, value.join('; '));
      }
    }

    if (!headers.has('authorization')) {
      const token = new URL(request.url ?? '/ws', 'http://localhost').searchParams.get('token');

      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
    }

    return headers;
  }

  afterInit(): void {
    this.rooms.onEvent((roomId, event) => this.handleRoomEvent(roomId, event));

    setInterval(() => {
      for (const socket of this.sockets.values()) {
        if (socket.isAlive === false) {
          socket.terminate();

          continue;
        }

        socket.isAlive = false;
        socket.ping();
      }
    }, 30_000);

    this.logger.log('Realtime gateway ready on /ws');
  }

  async handleConnection(
    socket: Socket,
    request: { url?: string; headers: Record<string, string | string[] | undefined> }
  ): Promise<void> {
    const buffered: Buffer[] = [];
    let isReady = false;

    const dispatch = (raw: Buffer) => {
      this.handleMessage(socket, raw).catch((error) => {
        this.logger.error(`Failed to handle a message from ${socket.userId}`, error);

        this.send(socket, {
          type: 'error',
          payload: { message: 'Internal error', code: 'INTERNAL_ERROR' }
        });
      });
    };

    socket.on('message', (raw: Buffer) => {
      if (isReady) {
        dispatch(raw);

        return;
      }

      buffered.push(raw);
    });

    socket.on('pong', () => {
      socket.isAlive = true;
    });

    const userId = await this.auth.resolveUserId(this.toHeaders(request));

    if (!userId) {
      this.send(socket, {
        type: 'error',
        payload: { message: 'Sign in required', code: 'UNAUTHORIZED' }
      });
      socket.close(4401, 'Unauthorized');

      return;
    }

    const profile = await this.sessions.load(userId);

    const previous = this.sockets.get(userId);

    if (previous && previous !== socket) {
      previous.close(4409, 'Replaced by a new connection');
    }

    socket.userId = profile.userId;
    socket.isAlive = true;
    this.sockets.set(profile.userId, socket);

    this.send(socket, { type: 'connected', payload: { profile } });

    void this.recordVisit(profile.userId, socket);

    isReady = true;

    for (const raw of buffered) {
      dispatch(raw);
    }

    buffered.length = 0;

    const room = this.rooms.getRoomOfUser(profile.userId);

    if (room) {
      room.reconnect(profile.userId);
      this.sendTableJoined(profile.userId, room.id);
      this.sendGameState(room.id);
    }
  }

  handleDisconnect(socket: Socket): void {
    const userId = socket.userId;

    if (!userId) {
      return;
    }

    this.sockets.delete(userId);
    this.lobbySubscribers.delete(userId);
    this.rooms.handleDisconnect(userId);
    this.sessions.setOnline(userId, false);
    this.broadcastLobby();
  }

  private async handleMessage(socket: Socket, raw: Buffer): Promise<void> {
    const userId = socket.userId;

    if (!userId) {
      return;
    }

    try {
      await this.rateLimiter.consume(userId);
    } catch {
      this.send(socket, {
        type: 'error',
        payload: { message: 'Too many requests', code: 'RATE_LIMITED' }
      });

      return;
    }

    let message: ClientMessage;

    try {
      message = clientMessageSchema.parse(JSON.parse(raw.toString()));
    } catch {
      this.send(socket, {
        type: 'error',
        payload: { message: 'Malformed message', code: 'BAD_MESSAGE' }
      });

      return;
    }

    switch (message.type) {
      case 'ping':
        this.send(socket, { type: 'pong' });
        break;

      case 'lobby:subscribe':
        this.lobbySubscribers.add(userId);
        this.send(socket, {
          type: 'lobby:tables',
          payload: { tables: this.rooms.listTables() }
        });
        break;

      case 'lobby:unsubscribe':
        this.lobbySubscribers.delete(userId);
        break;

      case 'table:create':
        await this.handleCreateTable(socket, userId, message.payload);
        break;

      case 'table:join':
        await this.handleJoinTable(socket, userId, message.payload);
        break;

      case 'table:leave': {
        const room = this.rooms.getRoomOfUser(userId);

        this.rooms.leave(userId);
        this.send(socket, { type: 'table:left' });

        if (room) {
          this.broadcastTable(room.id);
        }

        this.broadcastLobby();
        break;
      }

      case 'table:ready': {
        const room = this.rooms.getRoomOfUser(userId);

        room?.setReady(userId, message.payload.isReady);

        if (room) {
          this.broadcastTable(room.id);
        }

        break;
      }

      case 'table:add-bot':
        this.handleAddBot(socket, userId);
        break;

      case 'profile:set-avatar': {
        const profile = await this.profiles.setAvatar(userId, message.payload.seed);

        this.send(socket, { type: 'profile:updated', payload: { profile } });
        this.refreshSeatedProfile(userId, profile);
        break;
      }

      case 'profile:set-name': {
        const profile = await this.profiles.setName(userId, message.payload.name);

        this.send(socket, { type: 'profile:updated', payload: { profile } });
        this.refreshSeatedProfile(userId, profile);
        break;
      }

      case 'friends:list':
        await this.sendFriendList(socket, userId);
        break;

      case 'friends:search': {
        const profiles = await this.friends.search(userId, message.payload.query);

        this.send(socket, { type: 'friends:found', payload: { profiles } });
        break;
      }

      case 'friends:request':
        await this.handleFriendAction(socket, userId, message.payload.userId, 'request');
        break;

      case 'friends:accept':
        await this.handleFriendAction(socket, userId, message.payload.userId, 'accept');
        break;

      case 'friends:decline':
        await this.handleFriendAction(socket, userId, message.payload.userId, 'decline');
        break;

      case 'friends:remove':
        await this.handleFriendAction(socket, userId, message.payload.userId, 'remove');
        break;

      case 'friends:invite':
        await this.handleInvite(socket, userId, message.payload.userId);
        break;

      case 'leaderboard:list': {
        const leaderboard = await this.leaderboard.top(userId);

        this.send(socket, { type: 'leaderboard:list', payload: leaderboard });
        break;
      }

      case 'achievements:list': {
        const achievements = await this.achievements.list(userId);

        this.send(socket, { type: 'achievements:list', payload: { achievements } });
        break;
      }

      case 'achievements:claim': {
        const result = await this.achievements.claim(userId, message.payload.achievementId);

        if ('error' in result) {
          this.send(socket, {
            type: 'error',
            payload: { message: 'That reward is not available', code: result.error }
          });

          break;
        }

        this.send(socket, {
          type: 'profile:updated',
          payload: { profile: await this.profiles.ensureProfile(userId) }
        });
        break;
      }

      case 'profile:claim-bonus':
        await this.handleClaimBonus(socket, userId);
        break;

      case 'game:action':
        this.handleGameAction(socket, userId, message.payload);
        break;

      case 'table:phrase': {
        const room = this.rooms.getRoomOfUser(userId);

        room?.sendPhrase(userId, message.payload.phraseId);
        break;
      }

      case 'table:emoji': {
        const room = this.rooms.getRoomOfUser(userId);

        room?.sendEmoji(userId, message.payload.emoji);
        break;
      }

      default:
        break;
    }
  }

  private async handleCreateTable(
    socket: Socket,
    userId: string,
    payload: CreateTableInput
  ): Promise<void> {
    const profile = this.sessions.get(userId);

    if (!profile) {
      return;
    }

    if (!(await this.profiles.canAfford(userId, payload.settings.bet))) {
      this.send(socket, {
        type: 'error',
        payload: { message: 'Not enough credits for this bet', code: 'NOT_ENOUGH_CREDITS' }
      });

      return;
    }

    if (payload.settings.isPrivate && !payload.password) {
      this.send(socket, {
        type: 'error',
        payload: { message: 'A private table needs a password', code: 'PASSWORD_REQUIRED' }
      });

      return;
    }

    this.rooms.leave(userId);

    const passwordHash = payload.password ? hashTablePassword(payload.password) : null;
    const room = this.rooms.createRoom(payload.settings, passwordHash);

    this.rooms.join(room, profile);

    void this.history.ensureTable(room.id, room.settings, passwordHash);

    this.sendTableJoined(userId, room.id);
    this.broadcastLobby();
  }

  private async handleJoinTable(
    socket: Socket,
    userId: string,
    payload: JoinTableInput
  ): Promise<void> {
    const profile = this.sessions.get(userId);
    const room = this.rooms.getRoom(payload.tableId);

    if (!profile || !room) {
      this.send(socket, {
        type: 'error',
        payload: { message: 'Table not found', code: 'TABLE_NOT_FOUND' }
      });

      return;
    }

    const isReturning = Boolean(room.getMember(userId));

    if (room.passwordHash && !isReturning) {
      if (!payload.password || !verifyTablePassword(payload.password, room.passwordHash)) {
        this.send(socket, {
          type: 'error',
          payload: { message: 'Wrong table password', code: 'WRONG_PASSWORD' }
        });

        return;
      }
    }

    if (!(await this.profiles.canAfford(userId, room.settings.bet))) {
      this.send(socket, {
        type: 'error',
        payload: { message: 'Not enough credits for this bet', code: 'NOT_ENOUGH_CREDITS' }
      });

      return;
    }

    if (!this.rooms.join(room, profile)) {
      this.send(socket, {
        type: 'error',
        payload: { message: 'The table is full', code: 'TABLE_FULL' }
      });

      return;
    }

    this.sendTableJoined(userId, room.id);
    this.broadcastTable(room.id);
    this.broadcastLobby();
  }

  private handleAddBot(socket: Socket, userId: string): void {
    if (!isDevelopment) {
      this.send(socket, {
        type: 'error',
        payload: { message: 'Bots are available in development only', code: 'BOTS_DISABLED' }
      });

      return;
    }

    const room = this.rooms.getRoomOfUser(userId);

    if (!room) {
      return;
    }

    if (room.isPlaying || room.isFull) {
      this.send(socket, {
        type: 'error',
        payload: { message: 'The table is full', code: 'TABLE_FULL' }
      });

      return;
    }

    const index = room.getMembers().filter((member) => member.isBot).length + 1;

    room.join(
      {
        userId: `bot:${room.id}:${index}`,
        name: `Bot ${index}`,
        avatarUrl: null,
        rating: 0,
        seasonRating: 0,
        gamesPlayed: 0,
        gamesWon: 0,
        gamesLost: 0,
        isPremium: false,
        isOnline: true
      },
      true
    );

    this.broadcastTable(room.id);
    this.broadcastLobby();
  }

  private async handleClaimBonus(socket: Socket, userId: string): Promise<void> {
    const profile = await this.profiles.claimFreeCredits(userId);

    if (!profile) {
      this.send(socket, {
        type: 'error',
        payload: { message: 'Bonus is not available yet', code: 'BONUS_NOT_READY' }
      });

      return;
    }

    this.send(socket, { type: 'profile:updated', payload: { profile } });
  }

  private refreshSeatedProfile(
    userId: string,
    profile: { avatarUrl: string | null; name: string }
  ): void {
    const room = this.rooms.getRoomOfUser(userId);

    if (!room?.updateProfile(userId, { name: profile.name, avatarUrl: profile.avatarUrl })) {
      return;
    }

    this.broadcastTable(room.id);
    this.broadcastLobby();
  }

  private handleGameAction(
    socket: Socket,
    userId: string,
    payload: { action: GameAction; expectedVersion: number }
  ): void {
    const room = this.rooms.getRoomOfUser(userId);

    if (!room) {
      return;
    }

    const error = room.applyAction(userId, payload.action, payload.expectedVersion);

    if (error) {
      this.send(socket, {
        type: 'game:rejected',
        payload: { code: error as GameErrorCode }
      });
    }
  }

  private handleRoomEvent(roomId: string, event: RoomEvent): void {
    switch (event.type) {
      case 'state-changed':
        this.sendGameState(roomId);
        this.broadcastLobby();
        break;

      case 'finished':
        void this.handleGameFinished(roomId, event.loserUserId, event.isDraw);
        break;

      case 'phrase':
        this.broadcastToRoom(roomId, {
          type: 'table:phrase',
          payload: { phrase: event.phrase }
        });
        break;

      case 'emoji':
        this.broadcastToRoom(roomId, {
          type: 'table:emoji',
          payload: { userId: event.userId, emoji: event.emoji }
        });
        break;

      default:
        break;
    }
  }

  private async handleGameFinished(
    roomId: string,
    loserUserId: string | null,
    isDraw: boolean
  ): Promise<void> {
    const room = this.rooms.getRoom(roomId);

    if (!room) {
      return;
    }

    const members = room.getMembers();
    const bet = room.settings.bet;
    const winners = members.filter((member) => member.profile.userId !== loserUserId);
    const prize = isDraw || winners.length === 0 ? 0 : Math.floor(bet / winners.length);

    const played: FinishedPlayer[] = [];

    for (const member of members) {
      const userId = member.profile.userId;
      const isLoser = userId === loserUserId;
      const creditsDelta = isDraw ? 0 : isLoser ? -bet : prize;
      const ratingDelta = isDraw || isLoser ? 0 : computeRatingGain(prize, member.profile.rating);

      if (!member.isBot) {
        await this.sessions.applyGameResult({
          userId,
          creditsDelta,
          ratingDelta,
          isWinner: !isLoser && !isDraw,
          isDraw
        });

        played.push({ userId, seat: member.seat, creditsDelta, ratingDelta, isLoser });
      }

      const unlocked = member.isBot
        ? []
        : await this.achievements.recordGame(userId, {
            isWin: !isLoser && !isDraw,

            isFlawless: false,
            endedOnTrumps: false,
            game: room.settings.game
          });

      const socket = this.sockets.get(userId);

      if (!socket) {
        continue;
      }

      this.send(socket, {
        type: 'game:finished',
        payload: { loserUserId, isDraw, creditsDelta, ratingDelta }
      });

      if (member.isBot) {
        continue;
      }

      if (unlocked.length > 0) {
        this.send(socket, { type: 'achievements:unlocked', payload: { ids: unlocked } });
      }

      this.send(socket, {
        type: 'profile:updated',
        payload: { profile: await this.sessions.reload(userId) }
      });
    }

    void this.history.recordFinishedGame({
      tableId: room.id,
      settings: room.settings,
      players: played,
      loserUserId,
      isDraw
    });
  }

  private sendGameState(roomId: string): void {
    const room = this.rooms.getRoom(roomId);

    if (!room) {
      return;
    }

    const profiles = room.getProfiles();

    for (const member of room.getMembers()) {
      if (member.isBot) {
        continue;
      }

      const socket = this.sockets.get(member.profile.userId);
      const view = room.getViewFor(member.profile.userId);

      if (!socket || !view) {
        continue;
      }

      this.send(socket, { type: 'game:state', payload: { view, players: profiles } });
    }
  }

  private sendTableJoined(userId: string, roomId: string): void {
    const socket = this.sockets.get(userId);
    const room = this.rooms.getRoom(roomId);

    if (!socket || !room) {
      return;
    }

    const seat = room.getMember(userId)?.seat ?? 0;

    this.send(socket, {
      type: 'table:joined',
      payload: { table: room.toLobbyTable(), seat }
    });
  }

  private broadcastToRoom(roomId: string, message: ServerMessage): void {
    const room = this.rooms.getRoom(roomId);

    if (!room) {
      return;
    }

    for (const member of room.getMembers()) {
      const socket = this.sockets.get(member.profile.userId);

      if (socket) {
        this.send(socket, message);
      }
    }
  }

  private async recordVisit(userId: string, socket: Socket): Promise<void> {
    const streak = await this.profiles.recordLogin(userId);
    const unlocked = await this.achievements.recordLoginStreak(userId, streak);

    if (unlocked.length > 0) {
      this.send(socket, { type: 'achievements:unlocked', payload: { ids: unlocked } });
    }
  }

  private async sendFriendList(socket: Socket, userId: string): Promise<void> {
    const list = await this.friends.list(userId);

    const withPresence = {
      friends: list.friends.map((friend) => ({
        ...friend,
        profile: {
          ...friend.profile,
          isOnline: this.sockets.has(friend.profile.userId)
        },
        tableId: this.rooms.getRoomOfUser(friend.profile.userId)?.id ?? null
      })),
      incoming: list.incoming,
      outgoing: list.outgoing
    };

    this.send(socket, { type: 'friends:list', payload: withPresence });
  }

  private async handleFriendAction(
    socket: Socket,
    userId: string,
    targetId: string,
    action: 'accept' | 'decline' | 'remove' | 'request'
  ): Promise<void> {
    const result = await this[`friend_${action}`](userId, targetId);

    if ('error' in result) {
      this.send(socket, {
        type: 'error',
        payload: { message: 'Could not update the friend list', code: result.error }
      });

      return;
    }

    await this.sendFriendList(socket, userId);

    const otherSocket = this.sockets.get(targetId);

    if (otherSocket) {
      await this.sendFriendList(otherSocket, targetId);
    }

    if (action === 'accept') {
      await this.achievements.recordFriend(userId);
      await this.achievements.recordFriend(targetId);
    }
  }

  private friend_request(userId: string, targetId: string) {
    return this.friends.request(userId, targetId);
  }

  private friend_accept(userId: string, targetId: string) {
    return this.friends.accept(userId, targetId);
  }

  private friend_decline(userId: string, targetId: string) {
    return this.friends.decline(userId, targetId);
  }

  private friend_remove(userId: string, targetId: string) {
    return this.friends.remove(userId, targetId);
  }

  private async handleInvite(socket: Socket, userId: string, targetId: string): Promise<void> {
    const room = this.rooms.getRoomOfUser(userId);

    if (!room) {
      this.send(socket, {
        type: 'error',
        payload: { message: 'You are not at a table', code: 'TABLE_NOT_FOUND' }
      });

      return;
    }

    if (!(await this.friends.areFriends(userId, targetId))) {
      this.send(socket, {
        type: 'error',
        payload: { message: 'You are not friends', code: 'NOT_FRIENDS' }
      });

      return;
    }

    const targetSocket = this.sockets.get(targetId);
    const from = await this.profiles.getPublicProfile(userId);

    if (!targetSocket || !from) {
      this.send(socket, {
        type: 'error',
        payload: { message: 'That player is offline', code: 'FRIEND_OFFLINE' }
      });

      return;
    }

    this.send(targetSocket, {
      type: 'friends:invited',
      payload: {
        id: `${userId}:${room.id}`,
        from,
        tableId: room.id,
        expiresAt: Date.now() + INVITE_TTL_MS
      }
    });
  }

  private broadcastTable(roomId: string): void {
    const room = this.rooms.getRoom(roomId);

    if (!room) {
      return;
    }

    this.broadcastToRoom(roomId, {
      type: 'lobby:table-updated',
      payload: { table: room.toLobbyTable() }
    });
  }

  private broadcastLobby(): void {
    const tables = this.rooms.listTables();

    for (const userId of this.lobbySubscribers) {
      const socket = this.sockets.get(userId);

      if (socket) {
        this.send(socket, { type: 'lobby:tables', payload: { tables } });
      }
    }
  }

  private send(socket: Socket, message: ServerMessage): void {
    if (socket.readyState !== socket.OPEN) {
      return;
    }

    socket.send(JSON.stringify(message));
  }
}
