import { describe, expect, it } from 'vitest';

import { DISCARD_SPAN, TALON_SPAN } from '../../config/table-center';
import { fitTableCenter } from '../fit-table-center';

const CENTER = { width: 340, height: 420, maxCardWidth: 72, gap: 8, cardRatio: 2 / 3 };

describe('fitTableCenter', () => {
  it('fits the talon, three pairs and the discard in one row', () => {
    const { card, field } = fitTableCenter({ ...CENTER, slots: 6 });

    expect(card * TALON_SPAN + field + card * DISCARD_SPAN + CENTER.gap * 2).toBeLessThanOrEqual(
      CENTER.width
    );
  });

  it('never grows past the regular card', () => {
    expect(fitTableCenter({ ...CENTER, width: 2000, slots: 1 }).card).toBe(72);
  });

  it('shrinks to fit a third row when the transfer slot spills over', () => {
    const short = { ...CENTER, height: 260 };

    expect(fitTableCenter({ ...short, slots: 7 }).card).toBeLessThan(
      fitTableCenter({ ...short, slots: 6 }).card
    );
  });
});
