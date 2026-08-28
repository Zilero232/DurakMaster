import { INVITE_TTL_MS } from '@durak-master/schemas';
import { Injectable } from '@nestjs/common';
import { match } from 'ts-pattern';

import type { Socket } from '../realtime.types';

import { RoomsService } from '../../game';
import { ProfilesService } from '../../profile';
import { AchievementsService, FriendsService } from '../../social';
import { SocketRegistryService } from './socket-registry.service';

export type FriendAction = 'accept' | 'decline' | 'remove' | 'request';

@Injectable()
export class FriendsPresenceService {
  constructor(
    private readonly friends: FriendsService,
    private readonly rooms: RoomsService,
    private readonly profiles: ProfilesService,
    private readonly achievements: AchievementsService,
    private readonly registry: SocketRegistryService
  ) {}

  async sendList(socket: Socket, userId: string): Promise<void> {
    const list = await this.friends.list(userId);

    this.registry.send(socket, {
      type: 'friends:list',
      payload: {
        friends: list.friends.map((friend) => ({
          ...friend,
          profile: {
            ...friend.profile,
            isOnline: this.registry.has(friend.profile.userId)
          },
          tableId: this.rooms.getRoomOfUser(friend.profile.userId)?.id ?? null
        })),
        incoming: list.incoming,
        outgoing: list.outgoing
      }
    });
  }

  async apply(
    socket: Socket,
    userId: string,
    targetId: string,
    action: FriendAction
  ): Promise<void> {
    const result = await match(action)
      .with('request', () => this.friends.request(userId, targetId))
      .with('accept', () => this.friends.accept(userId, targetId))
      .with('decline', () => this.friends.decline(userId, targetId))
      .with('remove', () => this.friends.remove(userId, targetId))
      .exhaustive();

    if ('error' in result) {
      this.registry.send(socket, {
        type: 'error',
        payload: { message: 'Could not update the friend list', code: result.error }
      });

      return;
    }

    await this.sendList(socket, userId);

    const otherSocket = this.registry.get(targetId);

    if (otherSocket) {
      await this.sendList(otherSocket, targetId);
    }

    if (action === 'accept') {
      await this.achievements.recordFriend(userId);
      await this.achievements.recordFriend(targetId);
    }
  }

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
