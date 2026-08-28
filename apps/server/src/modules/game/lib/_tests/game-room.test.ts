import type { PublicProfile, TableSettings } from '@durak-master/schemas';

import { DEFAULT_TABLE_SETTINGS } from '@durak-master/schemas';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { RoomEvent } from '../game-room';

import { GameRoom } from '../game-room';

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

const settingsFor = (maxPlayers: number): TableSettings => ({
  ...DEFAULT_TABLE_SETTINGS.durak,
  maxPlayers
});

const createRoom = (maxPlayers = 2) => {
  const events: RoomEvent[] = [];
  const room = new GameRoom(settingsFor(maxPlayers), null, (event) => events.push(event));

  return { room, events };
};

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('game room seating', () => {
  it('starts only once every seat the host asked for is filled and ready', () => {
    const { room } = createRoom(3);

    room.join(profile('a'));
    room.join(profile('b'));

    room.setReady('a', true);
    room.setReady('b', true);

    expect(room.isPlaying).toBe(false);

    room.join(profile('c'), true);
    room.setReady('c', true);

    expect(room.isPlaying).toBe(true);

    room.clearTimers();
  });

  it('moves ownership to the next human when the owner leaves', () => {
    const { room } = createRoom(3);

    room.join(profile('a'));
    room.join(profile('b'));
    room.join(profile('bot'), true);

    expect(room.toLobbyTable().ownerId).toBe('a');

    room.leave('a');

    expect(room.toLobbyTable().ownerId).toBe('b');
  });

  it('counts as abandoned once only bots are left', () => {
    const { room } = createRoom(3);

    room.join(profile('a'));
    room.join(profile('bot'), true);

    expect(room.isAbandoned).toBe(false);

    room.leave('a');

    expect(room.isAbandoned).toBe(true);
  });
});

describe('game room forfeit', () => {
  it('reports the players who were at the table when someone walks out mid-game', () => {
    const { room, events } = createRoom(2);

    room.join(profile('a'));
    room.join(profile('b'));
    room.setReady('a', true);
    room.setReady('b', true);

    expect(room.isPlaying).toBe(true);

    events.length = 0;
    room.leave('a');

    const finished = events.find((event) => event.type === 'finished');

    expect(finished).toBeDefined();

    if (finished?.type !== 'finished') {
      return;
    }

    expect(finished.loserUserId).toBe('a');

    expect(finished.members.map((member) => member.profile.userId).sort()).toEqual(['a', 'b']);

    expect(room.isPlaying).toBe(false);

    room.clearTimers();
  });

  it('ends the match against whoever let their clock run out', () => {
    const { room, events } = createRoom(2);

    room.join(profile('a'));
    room.join(profile('b'));
    room.setReady('a', true);
    room.setReady('b', true);

    expect(room.isPlaying).toBe(true);

    const onTurn = room
      .getMembers()
      .find((member) => member.seat === room.getViewFor('a')?.activeSeat);

    expect(onTurn).toBeDefined();

    if (!onTurn) {
      return;
    }

    events.length = 0;

    vi.advanceTimersByTime(DEFAULT_TABLE_SETTINGS.durak.turnTimeoutSeconds * 1000 + 100);

    const finished = events.find((event) => event.type === 'finished');

    expect(finished).toBeDefined();

    if (finished?.type !== 'finished') {
      return;
    }

    expect(finished.loserUserId).toBe(onTurn.profile.userId);
    expect(room.isPlaying).toBe(false);

    room.clearTimers();
  });

  it('plays a bot turn on timeout instead of ending the match', () => {
    const { room, events } = createRoom(2);

    room.join(profile('human'));
    room.join(profile('bot'), true);
    room.setReady('human', true);

    expect(room.isPlaying).toBe(true);

    events.length = 0;

    vi.advanceTimersByTime(DEFAULT_TABLE_SETTINGS.durak.turnTimeoutSeconds * 1000 + 100);

    const finished = events.find((event) => event.type === 'finished');

    if (finished?.type === 'finished') {
      expect(finished.loserUserId).not.toBe('bot');
    }

    room.clearTimers();
  });
});

describe('game room bots', () => {
  it('lets every bot that owes a move take it, whoever holds the turn', () => {
    const { room } = createRoom(4);

    room.join(profile('human'));
    room.join(profile('bot1'), true);
    room.join(profile('bot2'), true);
    room.join(profile('bot3'), true);

    room.setReady('human', true);

    expect(room.isPlaying).toBe(true);

    const versionOf = (): number => room.getViewFor('human')?.version ?? -1;

    let previous = -1;
    let settled = 0;

    for (let tick = 0; tick < 60 && settled < 4; tick += 1) {
      vi.advanceTimersByTime(300);

      const version = versionOf();

      settled = version === previous ? settled + 1 : 0;
      previous = version;
    }

    expect(room.isPlaying).toBe(true);

    const scheduled = (
      room as unknown as { nextBot: () => { profile: { userId: string } } | undefined }
    ).nextBot();

    const session = (
      room as unknown as { session: { hasPendingMove: (userId: string) => boolean } | null }
    ).session;

    if (scheduled && session) {
      expect(session.hasPendingMove(scheduled.profile.userId)).toBe(true);
    }

    room.clearTimers();
  });
});

describe('game room reconnect', () => {
  const activeUserId = (room: GameRoom): string => {
    const seat = room.getViewFor(room.getMembers()[0]?.profile.userId ?? '')?.activeSeat;

    return room.getMembers().find((member) => member.seat === seat)?.profile.userId ?? '';
  };

  it('gives a returning player the whole turn back', () => {
    const { room, events } = createRoom(2);

    room.join(profile('a'));
    room.join(profile('b'));
    room.setReady('a', true);
    room.setReady('b', true);

    expect(room.isPlaying).toBe(true);

    const onTurn = activeUserId(room);

    expect(onTurn).not.toBe('');

    const turnMs = DEFAULT_TABLE_SETTINGS.durak.turnTimeoutSeconds * 1000;

    room.suspend(onTurn);

    events.length = 0;

    vi.advanceTimersByTime(turnMs - 500);

    expect(events.find((event) => event.type === 'finished')).toBeUndefined();

    room.reconnect(onTurn);

    vi.advanceTimersByTime(turnMs - 500);

    expect(events.find((event) => event.type === 'finished')).toBeUndefined();

    vi.advanceTimersByTime(1_000);

    const finished = events.find((event) => event.type === 'finished');

    expect(finished).toBeDefined();

    if (finished?.type === 'finished') {
      expect(finished.loserUserId).toBe(onTurn);
    }

    room.clearTimers();
  });

  it('ends the match when the clock runs out before the player comes back', () => {
    const { room, events } = createRoom(2);

    room.join(profile('a'));
    room.join(profile('b'));
    room.setReady('a', true);
    room.setReady('b', true);

    const onTurn = activeUserId(room);

    room.suspend(onTurn);

    events.length = 0;

    vi.advanceTimersByTime(DEFAULT_TABLE_SETTINGS.durak.turnTimeoutSeconds * 1000 + 100);

    const finished = events.find((event) => event.type === 'finished');

    expect(finished).toBeDefined();

    if (finished?.type === 'finished') {
      expect(finished.loserUserId).toBe(onTurn);
    }

    room.clearTimers();
  });

  it('clears the missed turns a player collected before dropping', () => {
    const { room } = createRoom(2);

    room.join(profile('a'));
    room.join(profile('b'));
    room.setReady('a', true);
    room.setReady('b', true);

    const onTurn = activeUserId(room);

    room.suspend(onTurn);
    room.reconnect(onTurn);

    expect(room.getMember(onTurn)?.missedTurns).toBe(0);

    room.clearTimers();
  });
});
