import { describe, expect, it } from 'vitest';

import type { SeatBase } from '../fit-seat-to-row.types';

import { fitSeatToRow } from '../fit-seat-to-row';

const BASE: SeatBase = { avatar: 34, ring: 42, hat: 24, label: 11, minWidth: 76, maxWidth: 108 };

const LABEL = { min: 11, max: 15 };

const PHONE_WIDTH = 412;

describe('fitSeatToRow', () => {
  it('grows the seat when fewer opponents share the row', () => {
    const three = fitSeatToRow({ base: BASE, label: LABEL, width: PHONE_WIDTH, seats: 3 });
    const five = fitSeatToRow({ base: BASE, label: LABEL, width: PHONE_WIDTH, seats: 5 });

    expect(three.avatar).toBeGreaterThan(five.avatar);
    expect(three.back).toBeGreaterThan(five.back);
  });

  it('shrinks the seat when the row runs out of room', () => {
    const roomy = fitSeatToRow({ base: BASE, label: LABEL, width: PHONE_WIDTH, seats: 2 });
    const crowded = fitSeatToRow({ base: BASE, label: LABEL, width: PHONE_WIDTH, seats: 6 });

    expect(crowded.avatar).toBeLessThan(roomy.avatar);
    expect(crowded.maxWidth).toBeLessThan(roomy.maxWidth);
  });

  it('keeps a crowded row wide enough to stay tappable', () => {
    const { maxWidth, avatar } = fitSeatToRow({ base: BASE, label: LABEL, width: 320, seats: 6 });

    expect(maxWidth).toBeGreaterThanOrEqual(46);
    expect(avatar).toBeGreaterThan(0);
  });

  it('stops growing once the seat is already generous', () => {
    const wide = fitSeatToRow({ base: BASE, label: LABEL, width: 4000, seats: 1 });

    expect(wide.avatar).toBe(Math.round(BASE.avatar * 1.6));
  });

  it('falls back to the base width when nobody is seated', () => {
    const empty = fitSeatToRow({ base: BASE, label: LABEL, width: PHONE_WIDTH, seats: 0 });

    expect(empty.avatar).toBe(BASE.avatar);
    expect(empty.maxWidth).toBe(BASE.maxWidth);
  });
});
