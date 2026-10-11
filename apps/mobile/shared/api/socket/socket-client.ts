import type { ClientMessage, ServerMessage } from '@durak-master/schemas';

import { serverMessageSchema } from '@durak-master/schemas';
import { WebSocket as ReconnectingWebSocket } from 'partysocket';

import { WS_URL } from '@/shared/config';

import { getAuthToken } from '../auth/auth-client';

type SocketHandler = (message: ServerMessage) => void;

type SocketState = 'closed' | 'connecting' | 'open';

type SocketStateHandler = (state: SocketState) => void;

let authToken: string | null = null;

const readUrlWithFreshToken = async () => {
  authToken = await getAuthToken();

  return WS_URL;
};

type ReactNativeWebSocketConstructor = new (
  url: string,
  protocols?: string | string[],
  options?: { headers: Record<string, string> } | null
) => WebSocket;

const ReactNativeWebSocket = WebSocket as unknown as ReactNativeWebSocketConstructor;

class AuthorizedWebSocket extends ReactNativeWebSocket {
  constructor(url: string, protocols?: string | string[]) {
    super(url, protocols, authToken ? { headers: { Authorization: `Bearer ${authToken}` } } : null);
  }
}

export class SocketClient {
  private socket: ReconnectingWebSocket | null = null;
  private readonly handlers = new Set<SocketHandler>();
  private readonly stateHandlers = new Set<SocketStateHandler>();

  connect(): void {
    if (this.socket) {
      return;
    }

    const socket = new ReconnectingWebSocket(readUrlWithFreshToken, [], {
      WebSocket: AuthorizedWebSocket,
      maxReconnectionDelay: 8000,
      minReconnectionDelay: 500,
      reconnectionDelayGrowFactor: 1.6,
      maxRetries: Number.POSITIVE_INFINITY
    });

    this.socket = socket;
    this.notifyState('connecting');

    socket.addEventListener('open', () => {
      if (this.socket === socket) {
        this.notifyState('open');
      }
    });

    socket.addEventListener('close', () => {
      if (this.socket === socket) {
        this.notifyState('closed');
      }
    });

    socket.addEventListener('error', () => {
      if (this.socket === socket) {
        this.notifyState('closed');
      }
    });

    socket.addEventListener('message', (event) => {
      if (this.socket !== socket) {
        return;
      }

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
    const socket = this.socket;

    this.socket = null;
    socket?.close();
    this.notifyState('closed');
  }

  send(message: ClientMessage): boolean {
    if (!this.socket || this.socket.readyState !== this.socket.OPEN) {
      return false;
    }

    this.socket.send(JSON.stringify(message));

    return true;
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
