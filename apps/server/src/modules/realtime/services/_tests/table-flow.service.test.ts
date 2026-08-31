import type { PublicProfile, TableSettings } from '@durak-master/schemas';

import { DEFAULT_TABLE_SETTINGS } from '@durak-master/schemas';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { Socket } from '../../realtime.types';

import { RoomsService } from '../../../game';
import { TableFlowService } from '../table-flow.service';

const BET = 100;

const settings: TableSettings = { ...DEFAULT_TABLE_SETTINGS.durak, bet: BET, maxPlayers: 3 };

const headsUp: TableSettings = { ...settings, maxPlayers: 2 };

const profile = (userId: string): PublicProfile => ({
  userId,
  name: userId,
  avatarUrl: null,
  rating: 1000,
  seasonRating: 0,
  gamesPlayed: 0,
  gamesWon: 0,
  gamesLost: 0,
  isPremium: false,
  isOnline: true
});

const createWallet = (startingCredits: number) => {
  const credits = new Map<string, number>();

  const balanceOf = (userId: string) => credits.get(userId) ?? startingCredits;

  return {
    balanceOf,
    reserveStake: vi.fn(async (userId: string, bet: number) => {
      if (balanceOf(userId) < bet) {
        return false;
      }

      credits.set(userId, balanceOf(userId) - bet);

      return true;
    }),
    releaseStake: vi.fn(async (userId: string, bet: number) => {
      credits.set(userId, balanceOf(userId) + bet);
    })
  };
};

const createHarness = (startingCredits = 1_000) => {
  const rooms = new RoomsService();
  const wallet = createWallet(startingCredits);
  const errors: string[] = [];

  const sessions = { get: (userId: string) => profile(userId), load: vi.fn() };

  const sent: string[] = [];

  const registry = {
    send: (_socket: Socket, message: { type: string }) => sent.push(message.type),
    fail: (_socket: Socket, _message: string, code: string) => errors.push(code),
    failNotInGame: () => errors.push('NOT_IN_GAME')
  };

  const broadcast = { tableJoined: vi.fn(), table: vi.fn(), lobby: vi.fn() };

  rooms.onEvent((roomId, event) => {
    if (event.type === 'stake-released') {
      void wallet.releaseStake(event.userId, rooms.getRoom(roomId)?.settings.bet ?? 0);
    }
  });

  const flow = new TableFlowService(
    rooms,
    sessions as never,
    wallet as never,
    { ensureTable: vi.fn() } as never,
    registry as never,
    broadcast as never,
    { isDevelopment: true } as never
  );

  return { flow, rooms, wallet, errors, sent, socket: {} as Socket };
};

describe('table flow stakes', () => {
  let harness: ReturnType<typeof createHarness>;

  beforeEach(() => {
    harness = createHarness();
  });

  it('charges the bet once when the host opens a table', async () => {
    const { flow, wallet, socket } = harness;

    await flow.create(socket, 'host', { settings });

    expect(wallet.balanceOf('host')).toBe(900);
  });

  it('refunds the old table when the host opens another one', async () => {
    const { flow, wallet, socket } = harness;

    await flow.create(socket, 'host', { settings });
    await flow.create(socket, 'host', { settings });

    expect(wallet.balanceOf('host')).toBe(900);
  });

  it('does not charge again when a seated player sends join for their own table', async () => {
    const { flow, rooms, wallet, socket } = harness;

    await flow.create(socket, 'host', { settings });

    const tableId = rooms.listTables()[0]?.id ?? '';

    await flow.join(socket, 'host', { tableId });

    expect(wallet.balanceOf('host')).toBe(900);
  });

  it('refunds the table a player leaves behind when they join another one', async () => {
    const { flow, rooms, wallet, socket } = harness;

    await flow.create(socket, 'host', { settings });
    await flow.create(socket, 'guest', { settings });

    const hostTableId = rooms.listTables().find((table) => table.ownerId === 'host')?.id ?? '';

    await flow.join(socket, 'guest', { tableId: hostTableId });

    expect(wallet.balanceOf('guest')).toBe(900);
  });

  it('charges the bet again for a rematch at the same table', async () => {
    const { flow, rooms, wallet, socket } = harness;

    await flow.create(socket, 'host', { settings: headsUp });

    const room = rooms.getRoomOfUser('host');

    expect(room).toBeDefined();

    if (!room) {
      return;
    }

    rooms.join(room, profile('guest'));

    await flow.setReady(socket, 'host', true);
    await flow.setReady(socket, 'guest', true);

    expect(room.isPlaying).toBe(true);
    expect(wallet.balanceOf('host')).toBe(900);

    room.leave('guest');

    expect(room.isPlaying).toBe(false);
    expect(room.hasStakeHeld('host')).toBe(false);

    await flow.setReady(socket, 'host', true);

    expect(wallet.balanceOf('host')).toBe(800);

    room.clearTimers();
  });

  it('does not charge twice when a player readies up for the first round', async () => {
    const { flow, wallet, socket } = harness;

    await flow.create(socket, 'host', { settings });
    await flow.setReady(socket, 'host', true);

    expect(wallet.balanceOf('host')).toBe(900);

    harness.rooms.getRoomOfUser('host')?.clearTimers();
  });

  it('sends a player who cannot cover the rematch back to the lobby', async () => {
    const poor = createHarness(BET);

    await poor.flow.create(poor.socket, 'host', { settings: headsUp });

    const room = poor.rooms.getRoomOfUser('host');

    expect(room).toBeDefined();

    if (!room) {
      return;
    }

    poor.rooms.join(room, profile('guest'));

    await poor.flow.setReady(poor.socket, 'host', true);
    await poor.flow.setReady(poor.socket, 'guest', true);

    room.leave('guest');

    expect(poor.wallet.balanceOf('host')).toBe(0);

    await poor.flow.setReady(poor.socket, 'host', true);

    expect(poor.errors).toContain('NOT_ENOUGH_CREDITS');
    expect(poor.sent).toContain('table:left');
    expect(poor.rooms.getRoomOfUser('host')).toBeUndefined();

    room.clearTimers();
  });

  it('gives the bet back when a waiting player drops the connection', async () => {
    const { flow, rooms, wallet, socket } = harness;

    await flow.create(socket, 'host', { settings });

    expect(wallet.balanceOf('host')).toBe(900);

    rooms.handleDisconnect('host');

    expect(wallet.balanceOf('host')).toBe(1_000);
  });

  it('keeps the bet of a player who drops mid-match', async () => {
    const { flow, rooms, wallet, socket } = harness;

    await flow.create(socket, 'host', { settings: headsUp });

    const room = rooms.getRoomOfUser('host');

    expect(room).toBeDefined();

    if (!room) {
      return;
    }

    rooms.join(room, profile('guest'));

    await flow.setReady(socket, 'host', true);
    await flow.setReady(socket, 'guest', true);

    expect(room.isPlaying).toBe(true);

    rooms.handleDisconnect('host');

    expect(wallet.balanceOf('host')).toBe(900);

    room.clearTimers();
  });

  it('leaves the balance untouched when the bet is out of reach', async () => {
    const poor = createHarness(50);

    await poor.flow.create(poor.socket, 'host', { settings });

    expect(poor.wallet.balanceOf('host')).toBe(50);
    expect(poor.errors).toContain('NOT_ENOUGH_CREDITS');
  });
});
