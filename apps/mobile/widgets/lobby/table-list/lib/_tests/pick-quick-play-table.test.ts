import type { LobbyTable } from '@durak-master/schemas';

import { DEFAULT_TABLE_SETTINGS } from '@durak-master/schemas';
import { describe, expect, it } from 'vitest';

import { pickQuickPlayTable } from '../pick-quick-play-table';

const ME = 'me';

type TableInput = {
  id: string;
  bet?: number;
  seated?: string[];
  maxPlayers?: number;
  status?: LobbyTable['status'];
  isPrivate?: boolean;
  createdAt?: number;
};

const table = ({
  id,
  bet = 100,
  seated = ['someone'],
  maxPlayers = 4,
  status = 'waiting',
  isPrivate = false,
  createdAt = 0
}: TableInput): LobbyTable => ({
  id,
  status,
  settings: { ...DEFAULT_TABLE_SETTINGS.durak, bet, maxPlayers, isPrivate },
  players: seated.map((userId, seat) => ({
    userId,
    name: userId,
    avatarUrl: null,
    rating: 1000,
    seat,
    isReady: false
  })),
  ownerId: seated[0] ?? null,
  hasPremiumPlayer: false,
  createdAt
});

describe('pickQuickPlayTable', () => {
  it('returns null when nothing is joinable', () => {
    expect(pickQuickPlayTable({ tables: [], credits: 1_000, myUserId: ME })).toBeNull();
  });

  it('skips private, playing, full and unaffordable tables', () => {
    const tables = [
      table({ id: 'private', isPrivate: true }),
      table({ id: 'playing', status: 'playing' }),
      table({ id: 'full', seated: ['a', 'b'], maxPlayers: 2 }),
      table({ id: 'expensive', bet: 5_000 })
    ];

    expect(pickQuickPlayTable({ tables, credits: 1_000, myUserId: ME })).toBeNull();
  });

  it('skips a table the player already sits at', () => {
    const tables = [table({ id: 'mine', seated: [ME] })];

    expect(pickQuickPlayTable({ tables, credits: 1_000, myUserId: ME })).toBeNull();
  });

  it('lets the player stake exactly their whole balance', () => {
    const tables = [table({ id: 'all-in', bet: 1_000 })];

    expect(pickQuickPlayTable({ tables, credits: 1_000, myUserId: ME })?.id).toBe('all-in');
  });

  it('prefers the table closest to starting', () => {
    const tables = [
      table({ id: 'one-seated', seated: ['a'] }),
      table({ id: 'three-seated', seated: ['a', 'b', 'c'] })
    ];

    expect(pickQuickPlayTable({ tables, credits: 1_000, myUserId: ME })?.id).toBe('three-seated');
  });

  it('breaks a tie by the lower bet, then by the older table', () => {
    const tables = [
      table({ id: 'pricier', bet: 500 }),
      table({ id: 'newer', bet: 100, createdAt: 2 }),
      table({ id: 'older', bet: 100, createdAt: 1 })
    ];

    expect(pickQuickPlayTable({ tables, credits: 1_000, myUserId: ME })?.id).toBe('older');
  });
});
