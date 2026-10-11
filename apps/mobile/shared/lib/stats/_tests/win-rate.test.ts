import { describe, expect, it } from 'vitest';

import { getWinRate } from '../win-rate';

describe('getWinRate', () => {
  it('is zero before the first game', () => {
    expect(getWinRate({ gamesPlayed: 0, gamesWon: 0 })).toBe(0);
  });

  it('counts draws as games that were not won', () => {
    expect(getWinRate({ gamesPlayed: 4, gamesWon: 1 })).toBe(0.25);
  });
});
