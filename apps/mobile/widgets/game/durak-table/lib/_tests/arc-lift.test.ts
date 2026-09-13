import { describe, expect, it } from 'vitest';

import { arcLift } from '../arc-lift';

describe('arcLift', () => {
  it('keeps a short row flat', () => {
    expect(arcLift({ index: 0, total: 2 })).toBe(0);
    expect(arcLift({ index: 1, total: 2 })).toBe(0);
  });

  it('lifts the middle seat highest', () => {
    const lifts = [0, 1, 2, 3, 4].map((index) => arcLift({ index, total: 5 }));

    expect(Math.max(...lifts)).toBe(lifts[2]);
  });

  it('drops back to the felt at both ends', () => {
    expect(arcLift({ index: 0, total: 5 })).toBe(0);
    expect(arcLift({ index: 4, total: 5 })).toBe(0);
  });

  it('rises symmetrically around the middle', () => {
    expect(arcLift({ index: 1, total: 5 })).toBe(arcLift({ index: 3, total: 5 }));
  });
});
