import { describe, expect, it } from 'vitest';

import { fanOverlap } from '../fan-overlap';

const CARD_WIDTH = 80;

const LOOSE_RATIO = -0.45;

describe('fanOverlap', () => {
  it('leaves a single card alone', () => {
    expect(
      fanOverlap({ count: 1, width: CARD_WIDTH, available: 400, looseRatio: LOOSE_RATIO })
    ).toBe(0);
  });

  it('keeps the loose spread while the hand still fits', () => {
    expect(
      fanOverlap({ count: 3, width: CARD_WIDTH, available: 2000, looseRatio: LOOSE_RATIO })
    ).toBe(CARD_WIDTH * LOOSE_RATIO);
  });

  it('tightens past the loose spread once the row is too narrow', () => {
    const roomy = fanOverlap({
      count: 8,
      width: CARD_WIDTH,
      available: 2000,
      looseRatio: LOOSE_RATIO
    });
    const cramped = fanOverlap({
      count: 8,
      width: CARD_WIDTH,
      available: 300,
      looseRatio: LOOSE_RATIO
    });

    expect(cramped).toBeLessThan(roomy);
  });

  it('tightens the fan until a wide hand fits the row', () => {
    const available = 360;
    const count = 8;

    const overlap = fanOverlap({ count, width: CARD_WIDTH, available, looseRatio: LOOSE_RATIO });
    const span = CARD_WIDTH + (count - 1) * (CARD_WIDTH + overlap);

    expect(Math.round(span)).toBeLessThanOrEqual(available);
  });

  it('never overlaps so far that the cards stack in reverse', () => {
    const overlap = fanOverlap({
      count: 36,
      width: CARD_WIDTH,
      available: 360,
      looseRatio: LOOSE_RATIO
    });

    expect(overlap).toBeGreaterThan(-CARD_WIDTH);
  });
});
