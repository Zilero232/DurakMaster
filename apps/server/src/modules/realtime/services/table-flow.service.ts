import type { CreateTableInput, JoinTableInput } from '@durak-master/schemas';

import { Injectable, Logger } from '@nestjs/common';

import type { Socket } from '../realtime.types';

import { AppConfigService } from '../../../config/config.service';
import {
  GameHistoryService,
  hashTablePassword,
  RoomsService,
  verifyTablePassword
} from '../../game';
import { ProfilesService } from '../../profile';
import { TableInvitesService } from '../../social';
import { BroadcastService } from './broadcast.service';
import { SessionsService } from './sessions.service';
import { SocketRegistryService } from './socket-registry.service';

const BOT_PROFILE = {
  rating: 0,
  seasonRating: 0,
  gamesPlayed: 0,
  gamesWon: 0,
  gamesLost: 0,
  isPremium: false,
  isOnline: true
};

const hasDisconnected = (socket: Socket): boolean => socket.readyState !== socket.OPEN;

@Injectable()
export class TableFlowService {
  private readonly logger = new Logger(TableFlowService.name);
  private readonly busyUserIds = new Set<string>();

  constructor(
    private readonly rooms: RoomsService,
    private readonly sessions: SessionsService,
    private readonly profiles: ProfilesService,
    private readonly history: GameHistoryService,
    private readonly registry: SocketRegistryService,
    private readonly broadcast: BroadcastService,
    private readonly config: AppConfigService,
    private readonly invites: TableInvitesService
  ) {}

  async create(socket: Socket, userId: string, payload: CreateTableInput): Promise<void> {
    await this.oneAtATime(socket, userId, () => this.createTable(socket, userId, payload));
  }

  async join(socket: Socket, userId: string, payload: JoinTableInput): Promise<void> {
    await this.oneAtATime(socket, userId, () => this.joinTable(socket, userId, payload));
  }

  async setReady(socket: Socket, userId: string, isReady: boolean): Promise<void> {
    await this.oneAtATime(socket, userId, () => this.markReady(socket, userId, isReady));
  }

  addBot(socket: Socket, userId: string): void {
    if (!this.config.isDevelopment) {
      this.registry.fail(socket, 'Bots are available in development only', 'BOTS_DISABLED');

      return;
    }

    const room = this.rooms.getRoomOfUser(userId);

    if (!room) {
      this.registry.failNotInGame(socket);

      return;
    }

    if (room.isPlaying || room.isFull) {
      this.registry.fail(socket, 'The table is full', 'TABLE_FULL');

      return;
    }

    const index = room.getMembers().filter((member) => member.isBot).length + 1;

    room.join(
      { ...BOT_PROFILE, userId: `bot:${room.id}:${index}`, name: `Bot ${index}`, avatarUrl: null },
      true
    );

    this.broadcast.table(room.id);
    this.broadcast.lobby();
  }

  private async oneAtATime(socket: Socket, userId: string, task: () => Promise<void>) {
    if (this.busyUserIds.has(userId)) {
      this.registry.send(socket, {
        type: 'error',
        payload: { message: 'Still handling your previous request', code: 'RATE_LIMITED' }
      });

      return;
    }

    this.busyUserIds.add(userId);

    try {
      await task();
    } finally {
      this.busyUserIds.delete(userId);
    }
  }

  private async createTable(
    socket: Socket,
    userId: string,
    payload: CreateTableInput
  ): Promise<void> {
    const profile = await this.seatedProfile(userId);

    if (!profile) {
      this.registry.fail(socket, 'Sign in required', 'USER_NOT_FOUND');

      return;
    }

    if (payload.settings.isPrivate && !payload.password) {
      this.registry.fail(socket, 'A private table needs a password', 'PASSWORD_REQUIRED');

      return;
    }

    this.rooms.leave(userId);

    if (!(await this.profiles.reserveStake(userId, payload.settings.bet))) {
      this.registry.fail(socket, 'Not enough credits for this bet', 'NOT_ENOUGH_CREDITS');

      return;
    }

    if (hasDisconnected(socket)) {
      await this.profiles.releaseStake(userId, payload.settings.bet);

      return;
    }

    const passwordHash = payload.password ? hashTablePassword(payload.password) : null;
    const room = this.rooms.createRoom(payload.settings, passwordHash);

    this.rooms.join(room, profile);

    void this.history.ensureTable(room.id, room.settings, passwordHash).catch((error: unknown) => {
      this.logger.error(`Failed to record table ${room.id}`, error);
    });

    this.broadcast.tableJoined(userId, room.id);
    this.broadcast.lobby();
  }

  private async joinTable(socket: Socket, userId: string, payload: JoinTableInput): Promise<void> {
    const profile = await this.seatedProfile(userId);
    const room = this.rooms.getRoom(payload.tableId);

    if (!profile) {
      this.registry.fail(socket, 'Sign in required', 'USER_NOT_FOUND');

      return;
    }

    if (!room) {
      this.registry.fail(socket, 'Table not found', 'TABLE_NOT_FOUND');

      return;
    }

    if (room.getMember(userId)) {
      this.rooms.join(room, profile);
      this.broadcast.tableJoined(userId, room.id);
      this.broadcast.table(room.id);

      return;
    }

    const isInvited = this.invites.isInvited({ userId, tableId: room.id });

    if (room.passwordHash && !isInvited) {
      const isCorrect =
        Boolean(payload.password) && verifyTablePassword(payload.password ?? '', room.passwordHash);

      if (!isCorrect) {
        this.registry.fail(socket, 'Wrong table password', 'WRONG_PASSWORD');

        return;
      }
    }

    if (room.isFull || room.isPlaying) {
      this.registry.fail(socket, 'The table is full', 'TABLE_FULL');

      return;
    }

    this.rooms.leave(userId);

    if (!(await this.profiles.reserveStake(userId, room.settings.bet))) {
      this.registry.fail(socket, 'Not enough credits for this bet', 'NOT_ENOUGH_CREDITS');

      return;
    }

    if (hasDisconnected(socket)) {
      await this.profiles.releaseStake(userId, room.settings.bet);

      return;
    }

    if (this.rooms.getRoom(room.id) !== room) {
      await this.profiles.releaseStake(userId, room.settings.bet);
      this.registry.fail(socket, 'Table not found', 'TABLE_NOT_FOUND');

      return;
    }

    if (!this.rooms.join(room, profile)) {
      await this.profiles.releaseStake(userId, room.settings.bet);
      this.registry.fail(socket, 'The table is full', 'TABLE_FULL');

      return;
    }

    this.broadcast.tableJoined(userId, room.id);
    this.broadcast.table(room.id);
    this.broadcast.lobby();
  }

  private async markReady(socket: Socket, userId: string, isReady: boolean): Promise<void> {
    const room = this.rooms.getRoomOfUser(userId);

    if (!room) {
      this.registry.failNotInGame(socket);

      return;
    }

    if (isReady && !room.hasStakeHeld(userId)) {
      if (!(await this.profiles.reserveStake(userId, room.settings.bet))) {
        this.registry.fail(socket, 'Not enough credits for this bet', 'NOT_ENOUGH_CREDITS');
        this.evict(socket, userId, room.id);

        return;
      }

      if (this.rooms.getRoomOfUser(userId) !== room || room.hasStakeHeld(userId)) {
        await this.profiles.releaseStake(userId, room.settings.bet);

        return;
      }

      room.holdStake(userId);
    }

    room.setReady(userId, isReady);
    this.broadcast.table(room.id);
  }

  private evict(socket: Socket, userId: string, roomId: string): void {
    this.rooms.leave(userId);
    this.registry.send(socket, { type: 'table:left' });

    this.broadcast.table(roomId);
    this.broadcast.lobby();
  }

  private async seatedProfile(userId: string) {
    const cached = this.sessions.get(userId);

    if (cached) {
      return cached;
    }

    await this.sessions.load(userId);

    return this.sessions.get(userId);
  }
}
