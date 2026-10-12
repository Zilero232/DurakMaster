import { describe, expect, it } from 'vitest';

import { fitFieldCard } from '../fit-field-card';

const FIELD = { fieldWidth: 220, fieldHeight: 300, maxWidth: 72, gap: 8, cardRatio: 2 / 3 };

describe('fitFieldCard', () => {
  it('keeps the regular size while there is room', () => {
    expect(fitFieldCard({ ...FIELD, slots: 1 })).toBe(72);
  });

  it('shrinks the cards once six pairs no longer fit', () => {
    const width = fitFieldCard({ ...FIELD, slots: 6 });

    expect(width).toBeLessThan(72);
    expect(width).toBeGreaterThan(40);
  });

  it('never goes past the regular size on an empty table', () => {
    expect(fitFieldCard({ ...FIELD, slots: 0 })).toBe(72);
  });
});
