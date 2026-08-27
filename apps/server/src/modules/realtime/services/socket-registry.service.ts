import type { ServerMessage } from '@durak-master/schemas';

import { Injectable } from '@nestjs/common';

import type { Socket } from '../realtime.types';

@Injectable()
export class SocketRegistryService {
  private readonly sockets = new Map<string, Socket>();
  private readonly lobbySubscribers = new Set<string>();

  add(userId: string, socket: Socket): Socket | undefined {
    const previous = this.sockets.get(userId);

    this.sockets.set(userId, socket);

    return previous;
  }

  remove(userId: string, socket: Socket): void {
    if (this.sockets.get(userId) === socket) {
      this.sockets.delete(userId);
    }

    this.lobbySubscribers.delete(userId);
  }

  get(userId: string): Socket | undefined {
    return this.sockets.get(userId);
  }

  has(userId: string): boolean {
    return this.sockets.has(userId);
  }

  all(): Socket[] {
    return [...this.sockets.values()];
  }

  subscribeToLobby(userId: string): void {
    this.lobbySubscribers.add(userId);
  }

  unsubscribeFromLobby(userId: string): void {
    this.lobbySubscribers.delete(userId);
  }

  getLobbySubscribers(): string[] {
    return [...this.lobbySubscribers];
  }

  send(socket: Socket, message: ServerMessage): void {
    if (socket.readyState === socket.OPEN) {
      socket.send(JSON.stringify(message));
    }
  }

  sendTo(userId: string, message: ServerMessage): void {
    const socket = this.sockets.get(userId);

    if (socket) {
      this.send(socket, message);
    }
  }
}
