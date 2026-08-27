import type { ClientMessage, MyProfile } from '@durak-master/schemas';
import type { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';

import { clientMessageSchema } from '@durak-master/schemas';
import { Logger } from '@nestjs/common';
import { WebSocketGateway } from '@nestjs/websockets';
import { RateLimiterMemory } from 'rate-limiter-flexible';

import type { Socket } from './realtime.types';
import type { ConnectionRequest } from './services';

import { RoomsService } from '../game';
import { ProfilesService } from '../profile';
import { AchievementsService, FriendsService, LeaderboardService } from '../social';
import { HEARTBEAT_INTERVAL_MS, RATE_LIMIT } from './realtime.config';
import {
  BroadcastService,
  ConnectionService,
  FriendsPresenceService,
  GameFlowService,
  SocketRegistryService,
  TableFlowService
} from './services';

@WebSocketGateway({ path: '/ws' })
export class RealtimeGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(RealtimeGateway.name);

  private readonly rateLimiter = new RateLimiterMemory(RATE_LIMIT);

  constructor(
    private readonly rooms: RoomsService,
    private readonly profiles: ProfilesService,
    private readonly friends: FriendsService,
    private readonly achievements: AchievementsService,
    private readonly leaderboard: LeaderboardService,
    private readonly registry: SocketRegistryService,
    private readonly connection: ConnectionService,
    private readonly broadcast: BroadcastService,
    private readonly tables: TableFlowService,
    private readonly games: GameFlowService,
    private readonly presence: FriendsPresenceService
  ) {}

  afterInit(): void {
    this.rooms.onEvent((roomId, event) => this.games.handleRoomEvent(roomId, event));

    setInterval(() => {
      for (const socket of this.registry.all()) {
        if (socket.isAlive === false) {
          socket.terminate();

          continue;
        }

        socket.isAlive = false;
        socket.ping();
      }
    }, HEARTBEAT_INTERVAL_MS);

    this.logger.log('Realtime gateway ready on /ws');
  }

  async handleConnection(socket: Socket, request: ConnectionRequest): Promise<void> {
    const buffered: Buffer[] = [];
    let isReady = false;

    const dispatch = (raw: Buffer) => {
      this.handleMessage(socket, raw).catch((error: unknown) => {
        this.logger.error(`Failed to handle a message from ${socket.userId}`, error);

        this.registry.send(socket, {
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

    const userId = await this.connection.authenticate(socket, request);

    if (!userId) {
      return;
    }

    await this.connection.welcome(socket, userId);

    isReady = true;

    for (const raw of buffered) {
      dispatch(raw);
    }

    buffered.length = 0;

    this.connection.restoreTable(userId);
  }

  handleDisconnect(socket: Socket): void {
    this.connection.disconnect(socket);
  }

  private async handleMessage(socket: Socket, raw: Buffer): Promise<void> {
    const { userId } = socket;

    if (!userId) {
      return;
    }

    if (!(await this.consumeRateLimit(userId))) {
      this.registry.send(socket, {
        type: 'error',
        payload: { message: 'Too many requests', code: 'RATE_LIMITED' }
      });

      return;
    }

    const message = this.parse(raw);

    if (!message) {
      this.registry.send(socket, {
        type: 'error',
        payload: { message: 'Malformed message', code: 'BAD_MESSAGE' }
      });

      return;
    }

    await this.route(socket, userId, message);
  }

  private async route(socket: Socket, userId: string, message: ClientMessage): Promise<void> {
    switch (message.type) {
      case 'ping':
        this.registry.send(socket, { type: 'pong' });
        break;

      case 'lobby:subscribe':
        this.registry.subscribeToLobby(userId);
        this.registry.send(socket, {
          type: 'lobby:tables',
          payload: { tables: this.rooms.listTables() }
        });
        break;

      case 'lobby:unsubscribe':
        this.registry.unsubscribeFromLobby(userId);
        break;

      case 'table:create':
        await this.tables.create(socket, userId, message.payload);
        break;

      case 'table:join':
        await this.tables.join(socket, userId, message.payload);
        break;

      case 'table:leave':
        this.leaveTable(socket, userId);
        break;

      case 'table:ready':
        this.setReady(userId, message.payload.isReady);
        break;

      case 'table:add-bot':
        this.tables.addBot(socket, userId);
        break;

      case 'table:phrase':
        this.rooms.getRoomOfUser(userId)?.sendPhrase(userId, message.payload.phraseId);
        break;

      case 'table:emoji':
        this.rooms.getRoomOfUser(userId)?.sendEmoji(userId, message.payload.emoji);
        break;

      case 'profile:set-avatar':
        await this.updateProfile(socket, userId, () =>
          this.profiles.setAvatar(userId, message.payload.seed)
        );
        break;

      case 'profile:set-name':
        await this.updateProfile(socket, userId, () =>
          this.profiles.setName(userId, message.payload.name)
        );
        break;

      case 'profile:claim-bonus':
        await this.tables.claimBonus(socket, userId);
        break;

      case 'game:action':
        this.games.applyAction(socket, userId, message.payload);
        break;

      case 'friends:list':
        await this.presence.sendList(socket, userId);
        break;

      case 'friends:search':
        this.registry.send(socket, {
          type: 'friends:found',
          payload: { profiles: await this.friends.search(userId, message.payload.query) }
        });
        break;

      case 'friends:request':
        await this.presence.apply(socket, userId, message.payload.userId, 'request');
        break;

      case 'friends:accept':
        await this.presence.apply(socket, userId, message.payload.userId, 'accept');
        break;

      case 'friends:decline':
        await this.presence.apply(socket, userId, message.payload.userId, 'decline');
        break;

      case 'friends:remove':
        await this.presence.apply(socket, userId, message.payload.userId, 'remove');
        break;

      case 'friends:invite':
        await this.presence.invite(socket, userId, message.payload.userId);
        break;

      case 'leaderboard:list':
        this.registry.send(socket, {
          type: 'leaderboard:list',
          payload: await this.leaderboard.top(userId)
        });
        break;

      case 'achievements:list':
        this.registry.send(socket, {
          type: 'achievements:list',
          payload: { achievements: await this.achievements.list(userId) }
        });
        break;

      case 'achievements:claim':
        await this.claimAchievement(socket, userId, message.payload.achievementId);
        break;

      default:
        break;
    }
  }

  private leaveTable(socket: Socket, userId: string): void {
    const room = this.rooms.getRoomOfUser(userId);

    this.rooms.leave(userId);
    this.registry.send(socket, { type: 'table:left' });

    if (room) {
      this.broadcast.table(room.id);
    }

    this.broadcast.lobby();
  }

  private setReady(userId: string, isReady: boolean): void {
    const room = this.rooms.getRoomOfUser(userId);

    room?.setReady(userId, isReady);

    if (room) {
      this.broadcast.table(room.id);
    }
  }

  private async updateProfile(
    socket: Socket,
    userId: string,
    update: () => Promise<MyProfile>
  ): Promise<void> {
    const profile = await update();

    this.registry.send(socket, { type: 'profile:updated', payload: { profile } });

    this.games.refreshSeatedProfile(userId, profile);
  }

  private async claimAchievement(
    socket: Socket,
    userId: string,
    achievementId: Parameters<AchievementsService['claim']>[1]
  ): Promise<void> {
    const result = await this.achievements.claim(userId, achievementId);

    if ('error' in result) {
      this.registry.send(socket, {
        type: 'error',
        payload: { message: 'That reward is not available', code: result.error }
      });

      return;
    }

    this.registry.send(socket, {
      type: 'profile:updated',
      payload: { profile: await this.profiles.ensureProfile(userId) }
    });
  }

  private async consumeRateLimit(userId: string): Promise<boolean> {
    try {
      await this.rateLimiter.consume(userId);

      return true;
    } catch {
      return false;
    }
  }

  private parse(raw: Buffer): ClientMessage | null {
    try {
      const parsed = clientMessageSchema.safeParse(JSON.parse(raw.toString()));

      return parsed.success ? parsed.data : null;
    } catch {
      return null;
    }
  }
}
