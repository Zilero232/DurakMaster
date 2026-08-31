import type { CreateTableInput, JoinTableInput } from '@durak-master/schemas';

import { Injectable } from '@nestjs/common';

import type { Socket } from '../realtime.types';

import { AppConfigService } from '../../../config';
import {
  GameHistoryService,
  hashTablePassword,
  RoomsService,
  verifyTablePassword
} from '../../game';
import { ProfilesService } from '../../profile';
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

@Injectable()
export class TableFlowService {
  constructor(
    private readonly rooms: RoomsService,
    private readonly sessions: SessionsService,
    private readonly profiles: ProfilesService,
    private readonly history: GameHistoryService,
    private readonly registry: SocketRegistryService,
    private readonly broadcast: BroadcastService,
    private readonly config: AppConfigService
  ) {}

  async create(socket: Socket, userId: string, payload: CreateTableInput): Promise<void> {
    const profile = await this.seatedProfile(userId);

    if (!profile) {
      this.registry.fail(socket, 'Sign in required', 'USER_NOT_FOUND');

      return;
    }

    if (payload.settings.isPrivate && !payload.password) {
      this.registry.fail(socket, 'A private table needs a password', 'PASSWORD_REQUIRED');

      return;
    }

    this.leaveCurrentRoom(userId);

    if (!(await this.profiles.reserveStake(userId, payload.settings.bet))) {
      this.registry.fail(socket, 'Not enough credits for this bet', 'NOT_ENOUGH_CREDITS');

      return;
    }

    const passwordHash = payload.password ? hashTablePassword(payload.password) : null;
    const room = this.rooms.createRoom(payload.settings, passwordHash);

    this.rooms.join(room, profile);

    void this.history.ensureTable(room.id, room.settings, passwordHash);

    this.broadcast.tableJoined(userId, room.id);
    this.broadcast.lobby();
  }

  async join(socket: Socket, userId: string, payload: JoinTableInput): Promise<void> {
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

    const isReturning = Boolean(room.getMember(userId));

    if (room.passwordHash && !isReturning) {
      const isCorrect =
        Boolean(payload.password) && verifyTablePassword(payload.password ?? '', room.passwordHash);

      if (!isCorrect) {
        this.registry.fail(socket, 'Wrong table password', 'WRONG_PASSWORD');

        return;
      }
    }

    if (isReturning) {
      this.rooms.join(room, profile);
      this.broadcast.tableJoined(userId, room.id);
      this.broadcast.table(room.id);

      return;
    }

    this.leaveCurrentRoom(userId);

    if (!(await this.profiles.reserveStake(userId, room.settings.bet))) {
      this.registry.fail(socket, 'Not enough credits for this bet', 'NOT_ENOUGH_CREDITS');

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

  async setReady(socket: Socket, userId: string, isReady: boolean): Promise<void> {
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

  private async seatedProfile(userId: string) {
    const cached = this.sessions.get(userId);

    if (cached) {
      return cached;
    }

    await this.sessions.load(userId);

    return this.sessions.get(userId);
  }

  private leaveCurrentRoom(userId: string): void {
    this.rooms.leave(userId);
  }
}
