import type { PublicProfile, TableSettings } from '@durak-master/schemas';

import { DEFAULT_TABLE_SETTINGS } from '@durak-master/schemas';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { PEEK_TALON_CARDS } from '../../config';
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

const cheatersTable: TableSettings = {
  ...DEFAULT_TABLE_SETTINGS.durak,
  maxPlayers: 2,
  rules: { ...DEFAULT_TABLE_SETTINGS.durak.rules, fairness: 'cheaters' }
};

const fairTable: TableSettings = {
  ...cheatersTable,
  rules: { ...cheatersTable.rules, fairness: 'fair' }
};

const dealtRoom = (settings = cheatersTable) => {
  const room = new GameRoom(settings, null, () => {});

  room.join(profile('a'));
  room.join(profile('b'));
  room.setReady('a', true);
  room.setReady('b', true);

  return room;
};

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('peek boosts', () => {
  it('shows only the top of the talon, never its whole order', () => {
    const room = dealtRoom();

    expect(room.peekTalon()).toHaveLength(PEEK_TALON_CARDS);

    room.clearTimers();
  });

  it("hands over an opponent's cards", () => {
    const room = dealtRoom();

    expect(room.peekHand('a', 'b')).not.toBeNull();

    room.clearTimers();
  });

  it('refuses to peek at a player who is not at the table', () => {
    const room = dealtRoom();

    expect(room.peekHand('a', 'nobody')).toBeNull();

    room.clearTimers();
  });

  it('refuses to peek at your own hand', () => {
    const room = dealtRoom();

    expect(room.peekHand('a', 'a')).toBeNull();

    room.clearTimers();
  });

  it('reveals nothing at a fair table', () => {
    const room = dealtRoom(fairTable);

    expect(room.allowsPeeking).toBe(false);
    expect(room.peekTalon()).toBeNull();
    expect(room.peekHand('a', 'b')).toBeNull();

    room.clearTimers();
  });
});
