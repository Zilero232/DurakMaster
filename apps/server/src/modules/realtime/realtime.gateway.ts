import type { ClientMessage, QuickPhraseId, TauntId, UseBoostInput } from '@durak-master/schemas';
import type { OnModuleDestroy } from '@nestjs/common';
import type { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';

import { BOOST_PRICE, clientMessageSchema } from '@durak-master/schemas';
import { Logger } from '@nestjs/common';
import { WebSocketGateway } from '@nestjs/websockets';
import { RateLimiterMemory } from 'rate-limiter-flexible';

import type { Socket } from './realtime.types';
import type { ConnectionRequest } from './services';

import { RoomsService } from '../game';
import { ProfilesService } from '../profile';
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
export class RealtimeGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, OnModuleDestroy
{
  private heartbeat: NodeJS.Timeout | null = null;
  private unsubscribe: (() => void) | null = null;
  private unsubscribeRemovals: (() => void) | null = null;

  private readonly logger = new Logger(RealtimeGateway.name);

  private readonly rateLimiter = new RateLimiterMemory(RATE_LIMIT);

  constructor(
    private readonly rooms: RoomsService,
    private readonly profiles: ProfilesService,
    private readonly registry: SocketRegistryService,
    private readonly connection: ConnectionService,
    private readonly broadcast: BroadcastService,
    private readonly tables: TableFlowService,
    private readonly games: GameFlowService,
    private readonly presence: FriendsPresenceService
  ) {}

  afterInit(): void {
    this.unsubscribe = this.rooms.onEvent((roomId, event) =>
      this.games.handleRoomEvent(roomId, event)
    );

    this.unsubscribeRemovals = this.rooms.onRoomRemoved((roomId) => {
      this.broadcast.tableRemoved(roomId);
      this.broadcast.lobby();
    });

    this.heartbeat = setInterval(() => {
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

    this.games.deliverPendingResult(userId);
  }

  onModuleDestroy(): void {
    if (this.heartbeat) {
      clearInterval(this.heartbeat);
      this.heartbeat = null;
    }

    this.unsubscribe?.();
    this.unsubscribe = null;

    this.unsubscribeRemovals?.();
    this.unsubscribeRemovals = null;
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
        await this.tables.setReady(socket, userId, message.payload.isReady);
        break;

      case 'table:boost':
        await this.useBoost(socket, userId, message.payload);
        break;

      case 'table:add-bot':
        this.tables.addBot(socket, userId);
        break;

      case 'table:phrase':
        this.sendPhrase(socket, userId, message.payload.phraseId);
        break;

      case 'table:emoji':
        this.sendEmoji(socket, userId, message.payload.emoji);
        break;

      case 'game:action':
        this.games.applyAction(socket, userId, message.payload);
        break;

      case 'friends:invite':
        await this.presence.invite(socket, userId, message.payload.userId);
        break;

      default:
        break;
    }
  }

  private leaveTable(socket: Socket, userId: string): void {
    const room = this.rooms.getRoomOfUser(userId);
    const isForfeit = room?.isPlaying ?? false;

    this.rooms.leave(userId);

    if (!isForfeit) {
      this.registry.send(socket, { type: 'table:left' });
    }

    if (room) {
      this.broadcast.table(room.id);
      this.broadcast.gameState(room.id);
    }

    this.broadcast.lobby();
  }

  private async useBoost(socket: Socket, userId: string, input: UseBoostInput): Promise<void> {
    const room = this.rooms.getRoomOfUser(userId);

    if (!room?.isPlaying) {
      this.registry.fail(socket, 'No game in progress', 'GAME_NOT_ACTIVE');

      return;
    }

    const price = BOOST_PRICE[input.boost];

    const coins = await this.profiles.spendCoins(userId, price);

    if (coins === null) {
      this.registry.fail(socket, 'Not enough coins', 'NOT_ENOUGH_COINS');

      return;
    }

    if (input.boost === 'undoMove' && !room.undoLastMove(userId)) {
      await this.profiles.refundCoins(userId, price);

      this.registry.fail(socket, 'Nothing to take back', 'INVALID_ACTION_FOR_PHASE');

      return;
    }

    this.registry.send(socket, {
      type: 'table:boost-used',
      payload: {
        boost: input.boost,
        coins,
        ...(input.boost === 'peekTalon' ? { talon: room.peekTalon() ?? [] } : {}),
        ...(input.boost === 'peekHand' && input.targetUserId
          ? { hand: room.peekHand(input.targetUserId) ?? [], targetUserId: input.targetUserId }
          : {})
      }
    });

    this.registry.send(socket, {
      type: 'profile:updated',
      payload: { profile: await this.profiles.ensureProfile(userId) }
    });

    if (input.boost === 'undoMove') {
      this.broadcast.gameState(room.id);
    }
  }

  private sendPhrase(socket: Socket, userId: string, phraseId: QuickPhraseId): void {
    const room = this.rooms.getRoomOfUser(userId);

    if (!room) {
      this.registry.failNotInGame(socket);

      return;
    }

    room.sendPhrase(userId, phraseId);
  }

  private sendEmoji(socket: Socket, userId: string, emoji: TauntId): void {
    const room = this.rooms.getRoomOfUser(userId);

    if (!room) {
      this.registry.failNotInGame(socket);

      return;
    }

    room.sendEmoji(userId, emoji);
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
