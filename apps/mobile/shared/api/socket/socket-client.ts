import type { ClientMessage, ServerMessage } from '@durak-master/schemas';
import type { NativeEventSubscription } from 'react-native';

import { serverMessageSchema } from '@durak-master/schemas';
import { AppState } from 'react-native';

import { WS_URL } from '@/shared/config';

import { getAuthToken } from '../auth/auth-client';
import { RECONNECT_DELAY } from './socket-client.config';

type SocketHandler = (message: ServerMessage) => void;

type SocketState = 'closed' | 'connecting' | 'open';

type SocketStateHandler = (state: SocketState) => void;

type ReactNativeWebSocketConstructor = new (
  url: string,
  protocols?: string | string[],
  options?: { headers: Record<string, string> } | null
) => WebSocket;

const ReactNativeWebSocket = WebSocket as unknown as ReactNativeWebSocketConstructor;

const reconnectDelay = (attempt: number) =>
  Math.min(RECONNECT_DELAY.min * RECONNECT_DELAY.growth ** attempt, RECONNECT_DELAY.max);

const parseServerMessage = (data: unknown): ServerMessage | null => {
  try {
    const result = serverMessageSchema.safeParse(JSON.parse(String(data)));

    return result.success ? result.data : null;
  } catch {
    return null;
  }
};

export class SocketClient {
  private socket: WebSocket | null = null;
  private isActive = false;
  private attempt = 0;
  private generation = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private appStateSubscription: NativeEventSubscription | null = null;
  private readonly handlers = new Set<SocketHandler>();
  private readonly stateHandlers = new Set<SocketStateHandler>();

  connect(): void {
    if (this.isActive) {
      return;
    }

    this.isActive = true;
    this.generation += 1;
    this.attempt = 0;
    this.appStateSubscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        this.reconnectNow();
      }
    });
    void this.open();
  }

  disconnect(): void {
    this.isActive = false;
    this.generation += 1;
    this.clearReconnectTimer();
    this.appStateSubscription?.remove();
    this.appStateSubscription = null;

    const socket = this.socket;

    this.socket = null;
    socket?.close();
    this.notifyState('closed');
  }

  send(message: ClientMessage): boolean {
    if (!this.isConnected || !this.socket) {
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

    if (this.isActive) {
      handler(this.isConnected ? 'open' : 'connecting');
    }

    return () => this.stateHandlers.delete(handler);
  }

  get isConnected(): boolean {
    return this.socket !== null && this.socket.readyState === WebSocket.OPEN;
  }

  private async open(): Promise<void> {
    const generation = this.generation;

    this.notifyState('connecting');

    const token = await getAuthToken();

    if (generation !== this.generation) {
      return;
    }

    const socket = new ReactNativeWebSocket(
      WS_URL,
      undefined,
      token ? { headers: { Authorization: `Bearer ${token}` } } : null
    );

    this.socket = socket;

    socket.onopen = () => {
      if (this.socket === socket) {
        this.attempt = 0;
        this.notifyState('open');
      }
    };

    socket.onmessage = (event) => {
      if (this.socket !== socket) {
        return;
      }

      const message = parseServerMessage(event.data);

      if (message) {
        this.handlers.forEach((handler) => handler(message));
      }
    };

    socket.onclose = () => {
      if (this.socket === socket) {
        this.socket = null;
        this.notifyState('closed');
        this.scheduleReconnect();
      }
    };
  }

  private reconnectNow(): void {
    if (!this.reconnectTimer) {
      return;
    }

    this.clearReconnectTimer();
    this.attempt = 0;
    void this.open();
  }

  private scheduleReconnect(): void {
    if (!this.isActive || this.reconnectTimer) {
      return;
    }

    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.attempt += 1;
      void this.open();
    }, reconnectDelay(this.attempt));
  }

  private clearReconnectTimer(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  private notifyState(state: SocketState): void {
    this.stateHandlers.forEach((handler) => handler(state));
  }
}

export const socketClient = new SocketClient();
