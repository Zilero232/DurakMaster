import { describe, expect, it } from 'vitest';

import { BET_BRACKETS } from '../../config';
import { matchesBet } from '../matches-bet';

describe('matchesBet', () => {
  it('lets everything through when no bracket is chosen', () => {
    expect(matchesBet({ bet: 1, filter: 'all' })).toBe(true);
    expect(matchesBet({ bet: 1_000_000, filter: 'all' })).toBe(true);
  });

  it('splits the brackets without leaving a gap', () => {
    const bets = [
      1,
      BET_BRACKETS.low,
      BET_BRACKETS.low + 1,
      BET_BRACKETS.mid,
      BET_BRACKETS.mid + 1
    ];

    for (const bet of bets) {
      const matched = (['low', 'mid', 'high'] as const).filter((filter) =>
        matchesBet({ bet, filter })
      );

      expect(matched, `bet ${bet}`).toHaveLength(1);
    }
  });

  it('puts a bracket edge in the lower bracket', () => {
    expect(matchesBet({ bet: BET_BRACKETS.low, filter: 'low' })).toBe(true);
    expect(matchesBet({ bet: BET_BRACKETS.mid, filter: 'mid' })).toBe(true);
  });
});
