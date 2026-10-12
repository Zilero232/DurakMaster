import type { LobbyTable, PublicProfile, TableSettings } from '@durak-master/schemas';
import type { OnModuleDestroy } from '@nestjs/common';

import { Injectable, Logger } from '@nestjs/common';

import type { RoomEvent } from '../lib';

import { RECONNECT_GRACE_MS } from '../config';
import { GameRoom } from '../lib';
import { GameHistoryService } from './game-history.service';

export type RoomListener = (roomId: string, event: RoomEvent) => Promise<void> | void;

export type RoomRemovedListener = (roomId: string) => void;

const removedUserIdsOf = (event: RoomEvent): string[] => {
  if (event.type === 'idle-removed') {
    return event.userIds;
  }

  if (event.type === 'finished' && event.removedUserId) {
    return [event.removedUserId];
  }

  return [];
};

@Injectable()
export class RoomsService implements OnModuleDestroy {
  private readonly logger = new Logger(RoomsService.name);
  private readonly rooms = new Map<string, GameRoom>();
  private readonly userRoom = new Map<string, string>();
  private readonly listeners = new Set<RoomListener>();
  private readonly removalListeners = new Set<RoomRemovedListener>();
  private readonly reconnectTimers = new Map<string, NodeJS.Timeout>();

  constructor(private readonly history: GameHistoryService) {}

  async onModuleDestroy(): Promise<void> {
    await Promise.all([...this.rooms.values()].map((room) => this.dropRoom(room)));
  }

  onEvent(listener: RoomListener): () => void {
    this.listeners.add(listener);

    return () => this.listeners.delete(listener);
  }

  onRoomRemoved(listener: RoomRemovedListener): () => void {
    this.removalListeners.add(listener);

    return () => this.removalListeners.delete(listener);
  }

  private async notify(roomId: string, event: RoomEvent): Promise<void> {
    await Promise.all([...this.listeners].map((listener) => listener(roomId, event)));
  }

  private handleRoomEvent(room: GameRoom, event: RoomEvent): void {
    void this.notify(room.id, event);

    const removedUserIds = removedUserIdsOf(event);

    if (removedUserIds.length === 0) {
      return;
    }

    for (const userId of removedUserIds) {
      this.forgetMember(room, userId);
    }

    void this.dropRoomIfAbandoned(room);
  }

  createRoom(settings: TableSettings, passwordHash: string | null): GameRoom {
    const room = new GameRoom(settings, passwordHash, (event) => this.handleRoomEvent(room, event));

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
      this.clearReconnectTimer(profile.userId);
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

    this.forgetMember(room, userId);
    room.leave(userId);

    void this.dropRoomIfAbandoned(room);
  }

  private forgetMember(room: GameRoom, userId: string): void {
    this.clearReconnectTimer(userId);

    if (this.userRoom.get(userId) === room.id) {
      this.userRoom.delete(userId);
    }
  }

  private async dropRoomIfAbandoned(room: GameRoom): Promise<void> {
    if (room.isAbandoned) {
      await this.dropRoom(room);
    }
  }

  private async dropRoom(room: GameRoom): Promise<void> {
    if (this.rooms.get(room.id) !== room) {
      return;
    }

    for (const member of room.getMembers()) {
      this.forgetMember(room, member.profile.userId);
    }

    const refunds = room
      .close()
      .map((userId) =>
        this.notify(room.id, { type: 'stake-released', userId, bet: room.settings.bet })
      );

    this.rooms.delete(room.id);

    for (const listener of this.removalListeners) {
      listener(room.id);
    }

    this.logger.log(`Room removed: ${room.id}`);

    await Promise.all([...refunds, this.history.closeTable(room.id)]);
  }

  handleDisconnect(userId: string): void {
    const room = this.getRoomOfUser(userId);

    if (!room) {
      return;
    }

    room.suspend(userId);

    this.clearReconnectTimer(userId);
    this.reconnectTimers.set(
      userId,
      setTimeout(() => {
        this.reconnectTimers.delete(userId);

        if (this.getRoomOfUser(userId) !== room) {
          return;
        }

        if (room.getMembers().every((member) => member.isBot || !member.isConnected)) {
          void this.dropRoom(room);

          return;
        }

        this.leave(userId);
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
}
