import { describe, expect, it } from 'vitest';

import { splitPot } from '../split-pot';

describe('splitPot', () => {
  it('gives the whole pot to a single winner', () => {
    expect(splitPot(100, [{ userId: 'a', outPlace: 1 }])).toEqual([{ userId: 'a', amount: 100 }]);
  });

  it('rewards the earlier exit with a larger share', () => {
    const shares = splitPot(60, [
      { userId: 'second', outPlace: 2 },
      { userId: 'first', outPlace: 1 },
      { userId: 'third', outPlace: 3 }
    ]);

    expect(shares).toEqual([
      { userId: 'first', amount: 30 },
      { userId: 'second', amount: 20 },
      { userId: 'third', amount: 10 }
    ]);
  });

  it('hands the rounding remainder to the last winner so the pot is never overpaid', () => {
    const shares = splitPot(10, [
      { userId: 'first', outPlace: 1 },
      { userId: 'second', outPlace: 2 }
    ]);

    expect(shares.reduce((sum, share) => sum + share.amount, 0)).toBe(10);
    expect(shares[0]?.amount).toBeGreaterThan(shares[1]?.amount ?? 0);
  });

  it('places winners without an exit place last', () => {
    const shares = splitPot(30, [
      { userId: 'unfinished', outPlace: null },
      { userId: 'first', outPlace: 1 }
    ]);

    expect(shares[0]?.userId).toBe('first');
    expect(shares[0]?.amount).toBeGreaterThan(shares[1]?.amount ?? 0);
  });

  it('pays nothing when the pot is empty', () => {
    expect(splitPot(0, [{ userId: 'a', outPlace: 1 }])).toEqual([{ userId: 'a', amount: 0 }]);
  });
});
