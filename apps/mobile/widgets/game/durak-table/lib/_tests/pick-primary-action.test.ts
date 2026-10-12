import { describe, expect, it } from 'vitest';

import type { PickPrimaryActionInput } from '../pick-primary-action.types';

import { pickPrimaryAction } from '../pick-primary-action';

const IDLE: PickPrimaryActionInput = {
  isWaiting: false,
  isReady: false,
  canTake: false,
  canPass: false,
  isTaking: false,
  isMainAttacker: false
};

describe('pickPrimaryAction', () => {
  it('asks to get ready while the table waits', () => {
    expect(pickPrimaryAction({ ...IDLE, isWaiting: true })).toBe('ready');
  });

  it('lets a ready player take it back while the table waits', () => {
    expect(pickPrimaryAction({ ...IDLE, isWaiting: true, isReady: true })).toBe('notReady');
  });

  it('offers to take when the defender can', () => {
    expect(pickPrimaryAction({ ...IDLE, canTake: true })).toBe('take');
  });

  it('calls the bout done for the main attacker once everything is beaten', () => {
    expect(pickPrimaryAction({ ...IDLE, canPass: true, isMainAttacker: true })).toBe('done');
  });

  it('says pass for a player who only throws in', () => {
    expect(pickPrimaryAction({ ...IDLE, canPass: true })).toBe('pass');
  });

  it('says pass once the defender takes, even for the main attacker', () => {
    expect(
      pickPrimaryAction({ ...IDLE, canPass: true, isMainAttacker: true, isTaking: true })
    ).toBe('pass');
  });

  it('shows nothing when there is no move to make', () => {
    expect(pickPrimaryAction(IDLE)).toBeNull();
  });
});
