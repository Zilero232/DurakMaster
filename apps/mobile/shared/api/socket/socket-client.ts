import type { ClientMessage, ServerMessage } from '@durak-master/schemas';

import { serverMessageSchema } from '@durak-master/schemas';
import { WebSocket as ReconnectingWebSocket } from 'partysocket';

export type SocketHandler = (message: ServerMessage) => void;

export class SocketClient {
  private socket: ReconnectingWebSocket | null = null;
  private readonly handlers = new Set<SocketHandler>();
  private pending: ClientMessage[] = [];

  connect(url: string): void {
    if (this.socket) {
      return;
    }

    this.socket = new ReconnectingWebSocket(url, [], {
      maxReconnectionDelay: 8000,
      minReconnectionDelay: 500,
      reconnectionDelayGrowFactor: 1.6,
      maxRetries: Number.POSITIVE_INFINITY
    });

    this.socket.addEventListener('open', () => {
      const queued = this.pending;

      this.pending = [];

      for (const message of queued) {
        this.send(message);
      }
    });

    this.socket.addEventListener('message', (event) => {
      let parsed: unknown;

      try {
        parsed = JSON.parse(String(event.data));
      } catch {
        return;
      }

      const result = serverMessageSchema.safeParse(parsed);

      if (!result.success) {
        return;
      }

      for (const handler of this.handlers) {
        handler(result.data);
      }
    });
  }

  disconnect(): void {
    this.socket?.close();
    this.socket = null;
    this.pending = [];
  }

  send(message: ClientMessage): void {
    if (!this.socket || this.socket.readyState !== this.socket.OPEN) {
      this.pending.push(message);

      return;
    }

    this.socket.send(JSON.stringify(message));
  }

  subscribe(handler: SocketHandler): () => void {
    this.handlers.add(handler);

    return () => this.handlers.delete(handler);
  }

  get isConnected(): boolean {
    return this.socket?.readyState === this.socket?.OPEN;
  }
}

export const socketClient = new SocketClient();
