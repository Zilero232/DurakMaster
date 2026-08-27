import type { ServerMessage } from '@durak-master/schemas';

import { Injectable } from '@nestjs/common';

import { RoomsService } from '../../game';
import { SocketRegistryService } from './socket-registry.service';

@Injectable()
export class BroadcastService {
  constructor(
    private readonly rooms: RoomsService,
    private readonly registry: SocketRegistryService
  ) {}

  toRoom(roomId: string, message: ServerMessage): void {
    const room = this.rooms.getRoom(roomId);

    if (!room) {
      return;
    }

    for (const member of room.getMembers()) {
      this.registry.sendTo(member.profile.userId, message);
    }
  }

  table(roomId: string): void {
    const room = this.rooms.getRoom(roomId);

    if (!room) {
      return;
    }

    this.toRoom(roomId, {
      type: 'lobby:table-updated',
      payload: { table: room.toLobbyTable() }
    });
  }

  lobby(): void {
    const tables = this.rooms.listTables();

    for (const userId of this.registry.getLobbySubscribers()) {
      this.registry.sendTo(userId, { type: 'lobby:tables', payload: { tables } });
    }
  }

  gameState(roomId: string): void {
    const room = this.rooms.getRoom(roomId);

    if (!room) {
      return;
    }

    const players = room.getProfiles();

    for (const member of room.getMembers()) {
      if (member.isBot) {
        continue;
      }

      const view = room.getViewFor(member.profile.userId);

      if (view) {
        this.registry.sendTo(member.profile.userId, {
          type: 'game:state',
          payload: { view, players }
        });
      }
    }
  }

  tableJoined(userId: string, roomId: string): void {
    const room = this.rooms.getRoom(roomId);

    if (!room) {
      return;
    }

    this.registry.sendTo(userId, {
      type: 'table:joined',
      payload: { table: room.toLobbyTable(), seat: room.getMember(userId)?.seat ?? 0 }
    });
  }
}
