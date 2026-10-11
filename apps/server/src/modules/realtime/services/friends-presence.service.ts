import { Injectable } from '@nestjs/common';

import type { Socket } from '../realtime.types';

import { RoomsService } from '../../game';
import { ProfilesService } from '../../profile';
import { FriendsService, TableInvitesService } from '../../social';
import { SocketRegistryService } from './socket-registry.service';

@Injectable()
export class FriendsPresenceService {
  constructor(
    private readonly friends: FriendsService,
    private readonly invites: TableInvitesService,
    private readonly rooms: RoomsService,
    private readonly profiles: ProfilesService,
    private readonly registry: SocketRegistryService
  ) {}

  async invite(socket: Socket, userId: string, targetId: string): Promise<void> {
    const room = this.rooms.getRoomOfUser(userId);

    if (!room) {
      this.registry.failNotInGame(socket);

      return;
    }

    if (room.isPlaying || room.isFull) {
      this.registry.fail(socket, 'The table is full', 'TABLE_FULL');

      return;
    }

    if (room.getMember(targetId)) {
      this.failWith(socket, 'That player is already at your table', 'ALREADY_AT_TABLE');

      return;
    }

    const invite = { fromId: userId, toId: targetId, tableId: room.id };

    if (this.invites.isCoolingDown(invite)) {
      this.failWith(socket, 'You have just invited that player', 'INVITE_COOLDOWN');

      return;
    }

    if (!(await this.friends.areFriends(userId, targetId))) {
      this.registry.fail(socket, 'You are not friends', 'NOT_FRIENDS');

      return;
    }

    const targetSocket = this.registry.get(targetId);
    const from = await this.profiles.getPublicProfile(userId);

    if (!targetSocket || !from) {
      this.registry.fail(socket, 'That player is offline', 'FRIEND_OFFLINE');

      return;
    }

    const expiresAt = this.invites.record(invite);

    this.registry.send(targetSocket, {
      type: 'friends:invited',
      payload: { id: `${userId}:${room.id}`, from, tableId: room.id, expiresAt }
    });
  }

  private failWith(socket: Socket, message: string, code: string): void {
    this.registry.send(socket, { type: 'error', payload: { message, code } });
  }
}
