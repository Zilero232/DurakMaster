import type { LobbyTable } from '@durak-master/schemas';

import { describe, expect, it } from 'vitest';

import { formatSeatedNames } from '../format-seated-names';

const players = (names: string[]): LobbyTable['players'] =>
  names.map((name, seat) => ({
    userId: name,
    name,
    avatarUrl: null,
    rating: 1000,
    seat,
    isReady: false
  }));

describe('formatSeatedNames', () => {
  it('has nothing to show for an empty table', () => {
    expect(formatSeatedNames([])).toBeNull();
  });

  it('shows a lone player by name', () => {
    expect(formatSeatedNames(players(['Anna']))).toBe('Anna');
  });

  it('names the first player and counts the rest', () => {
    expect(formatSeatedNames(players(['Anna', 'Boris', 'Vera']))).toBe('Anna +2');
  });
});
