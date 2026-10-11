import type { PublicProfile, TableSettings } from '@durak-master/schemas';

import { DEFAULT_TABLE_SETTINGS } from '@durak-master/schemas';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { Socket } from '../../realtime.types';

import { RoomsService } from '../../../game';
import { READY_TIMEOUT_MS } from '../../../game/config';
import { TableInvitesService } from '../../../social';
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
  const history = { closeTable: vi.fn(async () => {}) };
  const rooms = new RoomsService(history as never);
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

  const invites = new TableInvitesService();

  rooms.onEvent(async (_roomId, event) => {
    if (event.type === 'stake-released') {
      await wallet.releaseStake(event.userId, event.bet);
    }
  });

  const flow = new TableFlowService(
    rooms,
    sessions as never,
    wallet as never,
    { ensureTable: vi.fn(async () => {}) } as never,
    registry as never,
    broadcast as never,
    { isDevelopment: true } as never,
    invites
  );

  const socket = { readyState: 1, OPEN: 1 } as Socket;

  return { flow, rooms, history, wallet, errors, sent, socket, invites };
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

const seatHeadsUp = async (harness: ReturnType<typeof createHarness>) => {
  const { flow, rooms, socket } = harness;

  await flow.create(socket, 'host', { settings: headsUp });

  const room = rooms.getRoomOfUser('host');

  if (!room) {
    throw new Error('host is not seated');
  }

  rooms.join(room, profile('guest'));

  return room;
};

const startHeadsUp = async (harness: ReturnType<typeof createHarness>) => {
  const room = await seatHeadsUp(harness);

  await harness.flow.setReady(harness.socket, 'host', true);
  await harness.flow.setReady(harness.socket, 'guest', true);

  return room;
};

describe('table flow duplicate messages', () => {
  it('charges once when the same create arrives twice at once', async () => {
    const { flow, rooms, wallet, socket } = createHarness();

    await Promise.all([
      flow.create(socket, 'host', { settings }),
      flow.create(socket, 'host', { settings })
    ]);

    expect(wallet.balanceOf('host')).toBe(900);
    expect(rooms.listTables()).toHaveLength(1);

    rooms.getRoomOfUser('host')?.clearTimers();
  });

  it('charges once when the same join arrives twice at once', async () => {
    const { flow, rooms, wallet, socket } = createHarness();

    await flow.create(socket, 'host', { settings });

    const tableId = rooms.listTables()[0]?.id ?? '';

    await Promise.all([
      flow.join(socket, 'guest', { tableId }),
      flow.join(socket, 'guest', { tableId })
    ]);

    expect(wallet.balanceOf('guest')).toBe(900);

    rooms.getRoom(tableId)?.clearTimers();
  });

  it('charges once when a rematch ready arrives twice at once', async () => {
    const harness = createHarness();
    const { flow, wallet, socket } = harness;
    const room = await startHeadsUp(harness);

    room.leave('guest');

    await Promise.all([flow.setReady(socket, 'host', true), flow.setReady(socket, 'host', true)]);

    expect(wallet.balanceOf('host')).toBe(800);

    room.clearTimers();
  });
});

describe('table flow joining', () => {
  it('keeps the player at their table when the one they ask for is full', async () => {
    const harness = createHarness();
    const { flow, rooms, wallet, errors, socket } = harness;
    const fullTable = await seatHeadsUp(harness);

    await flow.create(socket, 'other', { settings });

    const ownTable = rooms.getRoomOfUser('other');

    await flow.join(socket, 'other', { tableId: fullTable.id });

    expect(errors).toContain('TABLE_FULL');
    expect(rooms.getRoomOfUser('other')).toBe(ownTable);
    expect(wallet.balanceOf('other')).toBe(900);

    fullTable.clearTimers();
    ownTable?.clearTimers();
  });

  it('gives the bet back when the player drops while it is being charged', async () => {
    const { flow, rooms, wallet, socket } = createHarness();

    await flow.create(socket, 'host', { settings });

    const tableId = rooms.listTables()[0]?.id ?? '';
    const closedSocket = { readyState: 3, OPEN: 1 } as Socket;

    await flow.join(closedSocket, 'guest', { tableId });

    expect(wallet.balanceOf('guest')).toBe(1_000);
    expect(rooms.getRoomOfUser('guest')).toBeUndefined();

    rooms.getRoom(tableId)?.clearTimers();
  });
});

describe('table flow private tables', () => {
  const privateSettings: TableSettings = { ...settings, isPrivate: true };

  it('asks a stranger for the password', async () => {
    const { flow, rooms, errors, socket } = createHarness();

    await flow.create(socket, 'host', { settings: privateSettings, password: 'secret' });

    const tableId = rooms.listTables()[0]?.id ?? '';

    await flow.join(socket, 'guest', { tableId });

    expect(errors).toContain('WRONG_PASSWORD');
    expect(rooms.getRoomOfUser('guest')).toBeUndefined();

    rooms.getRoom(tableId)?.clearTimers();
  });

  it('seats an invited friend without the password', async () => {
    const { flow, rooms, invites, socket } = createHarness();

    await flow.create(socket, 'host', { settings: privateSettings, password: 'secret' });

    const tableId = rooms.listTables()[0]?.id ?? '';

    invites.record({ fromId: 'host', toId: 'guest', tableId });

    await flow.join(socket, 'guest', { tableId });

    expect(rooms.getRoomOfUser('guest')?.id).toBe(tableId);

    rooms.getRoom(tableId)?.clearTimers();
  });
});

describe('table flow removals the room makes on its own', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('forgets an idle player and closes the table they leave empty', async () => {
    const { flow, rooms, history, wallet, socket } = createHarness();

    await flow.create(socket, 'host', { settings });

    const tableId = rooms.listTables()[0]?.id ?? '';

    vi.advanceTimersByTime(READY_TIMEOUT_MS + 100);

    expect(wallet.balanceOf('host')).toBe(1_000);
    expect(rooms.getRoomOfUser('host')).toBeUndefined();
    expect(rooms.getRoom(tableId)).toBeUndefined();
    expect(history.closeTable).toHaveBeenCalledWith(tableId);
  });

  it('does not charge an idle-kicked player who readies up afterwards', async () => {
    const { flow, rooms, wallet, errors, socket } = createHarness();

    await flow.create(socket, 'host', { settings });

    vi.advanceTimersByTime(READY_TIMEOUT_MS + 100);

    await flow.setReady(socket, 'host', true);

    expect(errors).toContain('NOT_IN_GAME');
    expect(wallet.balanceOf('host')).toBe(1_000);
    expect(rooms.listTables()).toHaveLength(0);
  });

  it('forgets a player who forfeits on the clock', async () => {
    const harness = createHarness();
    const { rooms } = harness;
    const room = await startHeadsUp(harness);

    const activeSeat = room.getViewFor('host')?.activeSeat;
    const onTurn = room.getMembers().find((member) => member.seat === activeSeat)?.profile.userId;
    const waiting = onTurn === 'host' ? 'guest' : 'host';

    vi.advanceTimersByTime(headsUp.turnTimeoutSeconds * 1000 + 100);

    expect(rooms.getRoomOfUser(onTurn ?? '')).toBeUndefined();
    expect(rooms.getRoomOfUser(waiting)).toBe(room);

    room.clearTimers();
  });
});

describe('table flow closing rooms', () => {
  it('refunds everyone when the last player drops mid-match', async () => {
    const harness = createHarness();
    const { rooms, wallet } = harness;
    const room = await startHeadsUp(harness);

    rooms.handleDisconnect('host');
    rooms.handleDisconnect('guest');

    expect(rooms.getRoom(room.id)).toBeUndefined();
    expect(wallet.balanceOf('host')).toBe(1_000);
    expect(wallet.releaseStake.mock.calls).toEqual([
      ['host', BET],
      ['guest', BET]
    ]);
  });

  it('refunds every waiting player before the server shuts down', async () => {
    const { flow, rooms, wallet, socket } = createHarness();

    await flow.create(socket, 'host', { settings });

    await rooms.onModuleDestroy();

    expect(wallet.balanceOf('host')).toBe(1_000);
    expect(rooms.listTables()).toHaveLength(0);
  });
});
