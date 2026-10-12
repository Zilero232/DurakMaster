import { describe, expect, it } from 'vitest';

import { signed } from '../signed';

describe('signed', () => {
  it('marks a gain with a plus', () => {
    expect(signed(25)).toBe('+25');
  });

  it('keeps the minus of a loss', () => {
    expect(signed(-100)).toBe('-100');
  });

  it('leaves zero bare', () => {
    expect(signed(0)).toBe('0');
  });
});
