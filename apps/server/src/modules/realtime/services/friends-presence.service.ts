import { INVITE_TTL_MS } from '@durak-master/schemas';
import { Injectable } from '@nestjs/common';

import type { Socket } from '../realtime.types';

import { RoomsService } from '../../game';
import { ProfilesService } from '../../profile';
import { FriendsService } from '../../social';
import { SocketRegistryService } from './socket-registry.service';

@Injectable()
export class FriendsPresenceService {
  constructor(
    private readonly friends: FriendsService,
    private readonly rooms: RoomsService,
    private readonly profiles: ProfilesService,
    private readonly registry: SocketRegistryService
  ) {}

  async invite(socket: Socket, userId: string, targetId: string): Promise<void> {
    const room = this.rooms.getRoomOfUser(userId);

    if (!room) {
      this.registry.send(socket, {
        type: 'error',
        payload: { message: 'You are not at a table', code: 'TABLE_NOT_FOUND' }
      });

      return;
    }

    if (!(await this.friends.areFriends(userId, targetId))) {
      this.registry.send(socket, {
        type: 'error',
        payload: { message: 'You are not friends', code: 'NOT_FRIENDS' }
      });

      return;
    }

    const targetSocket = this.registry.get(targetId);
    const from = await this.profiles.getPublicProfile(userId);

    if (!targetSocket || !from) {
      this.registry.send(socket, {
        type: 'error',
        payload: { message: 'That player is offline', code: 'FRIEND_OFFLINE' }
      });

      return;
    }

    this.registry.send(targetSocket, {
      type: 'friends:invited',
      payload: {
        id: `${userId}:${room.id}`,
        from,
        tableId: room.id,
        expiresAt: Date.now() + INVITE_TTL_MS
      }
    });
  }
}
