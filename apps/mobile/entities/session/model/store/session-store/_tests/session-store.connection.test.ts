import type { ServerMessage } from '@durak-master/schemas';

import { describe, expect, it, vi } from 'vitest';

import type { ConnectionStatus } from '../session-store.types';

const connect = vi.fn();

const handlers = new Set<(message: ServerMessage) => void>();

vi.mock('@/shared/api', () => ({
  getAuthToken: () => Promise.resolve('token'),
  socketClient: {
    connect: (...args: unknown[]) => connect(...args),
    disconnect: () => {},
    subscribe: (handler: (message: ServerMessage) => void) => {
      handlers.add(handler);

      return () => handlers.delete(handler);
    },
    subscribeState: () => () => {},
    send: () => {}
  }
}));

vi.mock('@/shared/config', () => ({ WS_URL: 'ws://test' }));

const { createConnection } = await import('../session-store.connection');

const build = (status: ConnectionStatus = 'connecting') => {
  handlers.clear();

  const seen: string[] = [];

  const connection = createConnection({
    onMessage: (message) => seen.push(message.type),
    onStatus: () => {},
    onDisconnected: () => {},
    getStatus: () => status,
    isLobbySubscribed: () => false
  });

  return { connection, seen };
};

describe('session connection', () => {
  it('opens the socket once the token is read', async () => {
    connect.mockClear();

    const { connection } = build();

    await connection.open();

    expect(connect).toHaveBeenCalledTimes(1);
  });

  it('does not open when the caller has given up', async () => {
    connect.mockClear();

    const { connection } = build('idle');

    await connection.open();

    expect(connect).not.toHaveBeenCalled();
  });
});
