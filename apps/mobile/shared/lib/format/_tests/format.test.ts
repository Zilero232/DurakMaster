import { describe, expect, it } from 'vitest';

import { formatCountdown, formatCredits } from '../format';

describe('formatCountdown', () => {
  it('drops the hours while under an hour', () => {
    expect(formatCountdown(90_000)).toBe('01:30');
  });

  it('shows hours once there are any', () => {
    expect(formatCountdown(3 * 3_600_000 + 61_000)).toBe('3:01:01');
  });

  it('keeps counting in hours past a full day', () => {
    expect(formatCountdown(25 * 3_600_000)).toBe('25:00:00');
  });

  it('floors a spent countdown at zero', () => {
    expect(formatCountdown(-5_000)).toBe('00:00');
  });
});

describe('formatCredits', () => {
  it('shortens thousands and millions', () => {
    expect(formatCredits(1_500)).toBe('1.5K');
    expect(formatCredits(2_000_000)).toBe('2M');
    expect(formatCredits(999)).toBe('999');
  });
});
