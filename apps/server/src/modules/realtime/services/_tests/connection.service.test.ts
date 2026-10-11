import { describe, expect, it, vi } from 'vitest';

import type { Socket } from '../../realtime.types';

import { ConnectionService } from '../connection.service';
import { SocketRegistryService } from '../socket-registry.service';

const createHarness = () => {
  const registry = new SocketRegistryService();
  const rooms = { handleDisconnect: vi.fn() };
  const sessions = { setOnline: vi.fn() };
  const broadcast = { lobby: vi.fn() };

  const connection = new ConnectionService(
    {} as never,
    sessions as never,
    rooms as never,
    {} as never,
    {} as never,
    registry,
    broadcast as never,
    { markOnline: vi.fn(), markOffline: vi.fn() } as never
  );

  return { connection, registry, rooms, sessions };
};

const socketOf = (userId: string) => ({ userId, readyState: 1, OPEN: 1 }) as Socket;

describe('connection disconnect', () => {
  it('lets the table know when the only socket of a player closes', () => {
    const { connection, registry, rooms, sessions } = createHarness();
    const socket = socketOf('player');

    registry.add('player', socket);
    connection.disconnect(socket);

    expect(rooms.handleDisconnect).toHaveBeenCalledWith('player');
    expect(sessions.setOnline).toHaveBeenCalledWith('player', false);
    expect(registry.get('player')).toBeUndefined();
  });

  it('ignores the close of a socket that a newer connection already replaced', () => {
    const { connection, registry, rooms, sessions } = createHarness();
    const replaced = socketOf('player');
    const current = socketOf('player');

    registry.add('player', replaced);
    registry.add('player', current);
    connection.disconnect(replaced);

    expect(rooms.handleDisconnect).not.toHaveBeenCalled();
    expect(sessions.setOnline).not.toHaveBeenCalled();
    expect(registry.get('player')).toBe(current);
  });
});
