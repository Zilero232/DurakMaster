import type { LobbyTable, PublicProfile, TableSettings } from '@durak-master/schemas';
import type { OnModuleDestroy } from '@nestjs/common';

import { Injectable, Logger } from '@nestjs/common';

import type { RoomEvent } from '../lib';

import { RECONNECT_GRACE_MS } from '../config';
import { GameRoom } from '../lib';

export type RoomListener = (roomId: string, event: RoomEvent) => void;

@Injectable()
export class RoomsService implements OnModuleDestroy {
  private readonly logger = new Logger(RoomsService.name);
  private readonly rooms = new Map<string, GameRoom>();
  private readonly userRoom = new Map<string, string>();
  private readonly listeners = new Set<RoomListener>();
  private readonly reconnectTimers = new Map<string, NodeJS.Timeout>();

  onModuleDestroy(): void {
    for (const timer of this.reconnectTimers.values()) {
      clearTimeout(timer);
    }

    this.reconnectTimers.clear();

    for (const room of this.rooms.values()) {
      room.clearTimers();
    }

    this.rooms.clear();
    this.userRoom.clear();
  }

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

    this.clearReconnectTimer(userId);
    room.leave(userId);

    this.userRoom.delete(userId);

    if (room.isAbandoned) {
      this.dropRoom(room);
    }
  }

  private dropRoom(room: GameRoom): void {
    for (const member of room.getMembers()) {
      this.userRoom.delete(member.profile.userId);
      this.clearReconnectTimer(member.profile.userId);
    }

    room.clearTimers();
    this.rooms.delete(room.id);
    this.notify(room.id, { type: 'state-changed' });
    this.logger.log(`Room removed: ${room.id}`);
  }

  handleDisconnect(userId: string): void {
    const room = this.getRoomOfUser(userId);

    if (!room) {
      return;
    }

    if (!room.isInMatch) {
      this.leave(userId);

      return;
    }

    room.suspend(userId);
    this.notify(room.id, { type: 'state-changed' });

    if (room.getMembers().every((member) => member.isBot || !member.isConnected)) {
      this.dropRoom(room);

      return;
    }

    this.clearReconnectTimer(userId);
    this.reconnectTimers.set(
      userId,
      setTimeout(() => {
        this.reconnectTimers.delete(userId);

        if (this.getRoomOfUser(userId) === room) {
          this.leave(userId);
        }
      }, RECONNECT_GRACE_MS)
    );
  }

  handleReconnect(userId: string): void {
    this.clearReconnectTimer(userId);
  }

  private clearReconnectTimer(userId: string): void {
    const timer = this.reconnectTimers.get(userId);

    if (timer) {
      clearTimeout(timer);
      this.reconnectTimers.delete(userId);
    }
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
