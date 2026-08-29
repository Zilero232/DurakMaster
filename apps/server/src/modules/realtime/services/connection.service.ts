import { Injectable, Logger } from '@nestjs/common';

import type { Socket } from '../realtime.types';

import { AuthService } from '../../../lib/auth/auth.service';
import { RoomsService } from '../../game';
import { ProfilesService } from '../../profile';
import { AchievementsService } from '../../social';
import { BroadcastService } from './broadcast.service';
import { SessionsService } from './sessions.service';
import { SocketRegistryService } from './socket-registry.service';

export type ConnectionRequest = {
  url?: string;
  headers: Record<string, string | string[] | undefined>;
};

const REPLACED_BY_NEW_CONNECTION = 4409;

const UNAUTHORIZED = 4401;

@Injectable()
export class ConnectionService {
  private readonly logger = new Logger(ConnectionService.name);

  constructor(
    private readonly auth: AuthService,
    private readonly sessions: SessionsService,
    private readonly rooms: RoomsService,
    private readonly profiles: ProfilesService,
    private readonly achievements: AchievementsService,
    private readonly registry: SocketRegistryService,
    private readonly broadcast: BroadcastService
  ) {}

  toHeaders(request: ConnectionRequest): Headers {
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

  async authenticate(socket: Socket, request: ConnectionRequest): Promise<string | null> {
    const userId = await this.auth.resolveUserId(this.toHeaders(request));

    if (!userId) {
      this.registry.send(socket, {
        type: 'error',
        payload: { message: 'Sign in required', code: 'UNAUTHORIZED' }
      });

      socket.close(UNAUTHORIZED, 'Unauthorized');

      return null;
    }

    return userId;
  }

  async welcome(socket: Socket, userId: string): Promise<void> {
    const profile = await this.sessions.load(userId);
    const previous = this.registry.add(profile.userId, socket);

    if (previous && previous !== socket) {
      previous.close(REPLACED_BY_NEW_CONNECTION, 'Replaced by a new connection');
    }

    socket.userId = profile.userId;
    socket.isAlive = true;

    this.registry.send(socket, { type: 'connected', payload: { profile } });

    void this.recordVisit(profile.userId, socket);
  }

  restoreTable(userId: string): void {
    const room = this.rooms.getRoomOfUser(userId);

    if (!room) {
      return;
    }

    this.rooms.handleReconnect(userId);
    room.reconnect(userId);

    this.broadcast.tableJoined(userId, room.id);
    this.broadcast.gameState(room.id);
  }

  disconnect(socket: Socket): void {
    const { userId } = socket;

    if (!userId) {
      return;
    }

    this.registry.remove(userId, socket);
    this.rooms.handleDisconnect(userId);
    this.sessions.setOnline(userId, false);
    this.broadcast.lobby();
  }

  private async recordVisit(userId: string, socket: Socket): Promise<void> {
    try {
      const streak = await this.profiles.recordLogin(userId);
      const unlocked = await this.achievements.recordLoginStreak(userId, streak);

      if (unlocked.length > 0) {
        this.registry.send(socket, { type: 'achievements:unlocked', payload: { ids: unlocked } });
      }
    } catch (error) {
      this.logger.error(`Could not record a visit for ${userId}`, error);
    }
  }
}
