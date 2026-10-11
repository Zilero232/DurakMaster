import type { ServerMessage } from '@durak-master/schemas';

import { describe, expect, it, vi } from 'vitest';

import type { ConnectionStatus } from '../session-store.types';

type SocketState = 'closed' | 'connecting' | 'open';

const messageHandlers = new Set<(message: ServerMessage) => void>();
const stateHandlers = new Set<(state: SocketState) => void>();

vi.mock('@/shared/api', () => ({
  socketClient: {
    subscribe: (handler: (message: ServerMessage) => void) => {
      messageHandlers.add(handler);

      return () => messageHandlers.delete(handler);
    },
    subscribeState: (handler: (state: SocketState) => void) => {
      stateHandlers.add(handler);

      return () => stateHandlers.delete(handler);
    }
  }
}));

const { listenToSocket } = await import('../session-store.connection');

const listen = () => {
  messageHandlers.clear();
  stateHandlers.clear();

  const statuses: ConnectionStatus[] = [];
  const onDisconnected = vi.fn();

  listenToSocket({
    onMessage: () => {},
    onStatus: (status) => statuses.push(status),
    onDisconnected
  });

  const emit = (state: SocketState) => stateHandlers.forEach((handler) => handler(state));

  return { statuses, onDisconnected, emit };
};

describe('session connection', () => {
  it('maps socket states onto connection statuses', () => {
    const { statuses, emit } = listen();

    emit('connecting');
    emit('open');

    expect(statuses).toEqual(['connecting', 'connected']);
  });

  it('reports a closed socket as an error and drops pending joins', () => {
    const { statuses, onDisconnected, emit } = listen();

    emit('closed');

    expect(statuses).toEqual(['error']);
    expect(onDisconnected).toHaveBeenCalledTimes(1);
  });
});
