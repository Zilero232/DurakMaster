import type { LobbyTable, PublicProfile, TableSettings } from '@durak-master/schemas';

import { Injectable, Logger } from '@nestjs/common';

import type { RoomEvent } from '../lib';

import { GameRoom } from '../lib';

export type RoomListener = (roomId: string, event: RoomEvent) => void;

@Injectable()
export class RoomsService {
  private readonly logger = new Logger(RoomsService.name);
  private readonly rooms = new Map<string, GameRoom>();
  private readonly userRoom = new Map<string, string>();
  private readonly listeners = new Set<RoomListener>();

  onEvent(listener: RoomListener): () => void {
    this.listeners.add(listener);

    return () => this.listeners.delete(listener);
  }

  private notify(roomId: string, event: RoomEvent): void {
    for (const listener of this.listeners) {
      listener(roomId, event);
    }
  }

  createRoom(settings: TableSettings, passwordHash: string | null): GameRoom {
    const room = new GameRoom(settings, passwordHash, (event) => this.notify(room.id, event));

    this.rooms.set(room.id, room);
    this.logger.log(`Room created: ${room.id}`);

    return room;
  }

  getRoom(roomId: string): GameRoom | undefined {
    return this.rooms.get(roomId);
  }

  getRoomOfUser(userId: string): GameRoom | undefined {
    const roomId = this.userRoom.get(userId);

    return roomId ? this.rooms.get(roomId) : undefined;
  }

  join(room: GameRoom, profile: PublicProfile): boolean {
    if (room.getMember(profile.userId)) {
      room.reconnect(profile.userId);
      this.userRoom.set(profile.userId, room.id);

      return true;
    }

    const member = room.join(profile);

    if (!member) {
      return false;
    }

    this.userRoom.set(profile.userId, room.id);

    return true;
  }

  leave(userId: string): void {
    const room = this.getRoomOfUser(userId);

    if (!room) {
      return;
    }

    room.leave(userId);

    if (room.memberCount === 0) {
      room.clearTimers();
      this.rooms.delete(room.id);
      this.notify(room.id, { type: 'state-changed' });
      this.logger.log(`Room removed: ${room.id}`);
    }

    this.userRoom.delete(userId);
  }

  handleDisconnect(userId: string): void {
    const room = this.getRoomOfUser(userId);

    if (!room) {
      return;
    }

    if (room.isInMatch) {
      room.leave(userId);

      return;
    }

    this.leave(userId);
  }

  listTables(): LobbyTable[] {
    return [...this.rooms.values()]
      .map((room) => room.toLobbyTable())
      .sort((a, b) => {
        if (a.hasPremiumPlayer !== b.hasPremiumPlayer) {
          return a.hasPremiumPlayer ? -1 : 1;
        }

        return b.createdAt - a.createdAt;
      });
  }

  listAllRooms(): GameRoom[] {
    return [...this.rooms.values()];
  }

  removeRoom(roomId: string): void {
    const room = this.rooms.get(roomId);

    if (!room) {
      return;
    }

    room.clearTimers();

    for (const member of room.getMembers()) {
      this.userRoom.delete(member.profile.userId);
    }

    this.rooms.delete(roomId);
  }
}
