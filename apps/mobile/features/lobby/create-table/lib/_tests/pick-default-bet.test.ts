import { describe, expect, it } from 'vitest';

import { pickDefaultBet } from '../pick-default-bet';

describe('pickDefaultBet', () => {
  it('suggests the usual bet when the balance covers it', () => {
    expect(pickDefaultBet(100_000)).toBe(1_000);
  });

  it('drops to the largest bet the balance can pay', () => {
    expect(pickDefaultBet(450)).toBe(100);
    expect(pickDefaultBet(700)).toBe(500);
  });

  it('never goes below the table minimum', () => {
    expect(pickDefaultBet(0)).toBe(100);
  });
});
