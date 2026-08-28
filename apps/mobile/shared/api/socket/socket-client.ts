import type { ClientMessage, ServerMessage } from '@durak-master/schemas';

import { serverMessageSchema } from '@durak-master/schemas';
import { WebSocket as ReconnectingWebSocket } from 'partysocket';

export type SocketHandler = (message: ServerMessage) => void;

export type SocketState = 'closed' | 'connecting' | 'open';

export type SocketStateHandler = (state: SocketState) => void;

export class SocketClient {
  private socket: ReconnectingWebSocket | null = null;
  private url: string | null = null;
  private readonly handlers = new Set<SocketHandler>();
  private readonly stateHandlers = new Set<SocketStateHandler>();
  private pending: ClientMessage[] = [];

  connect(url: string): void {
    if (this.socket) {
      if (this.url === url) {
        return;
      }

      this.disconnect();
    }

    this.url = url;

    this.socket = new ReconnectingWebSocket(url, [], {
      maxReconnectionDelay: 8000,
      minReconnectionDelay: 500,
      reconnectionDelayGrowFactor: 1.6,
      maxRetries: Number.POSITIVE_INFINITY
    });

    this.notifyState('connecting');

    this.socket.addEventListener('open', () => {
      const queued = this.pending;

      this.pending = [];

      for (const message of queued) {
        this.send(message);
      }

      this.notifyState('open');
    });

    this.socket.addEventListener('close', () => {
      this.notifyState('closed');
    });

    this.socket.addEventListener('error', () => {
      this.notifyState('closed');
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
    this.url = null;
    this.pending = [];
    this.notifyState('closed');
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

  subscribeState(handler: SocketStateHandler): () => void {
    this.stateHandlers.add(handler);

    if (this.socket) {
      handler(this.socket.readyState === this.socket.OPEN ? 'open' : 'connecting');
    }

    return () => this.stateHandlers.delete(handler);
  }

  private notifyState(state: SocketState): void {
    for (const handler of this.stateHandlers) {
      handler(state);
    }
  }

  get isConnected(): boolean {
    return this.socket !== null && this.socket.readyState === this.socket.OPEN;
  }
}

export const socketClient = new SocketClient();
