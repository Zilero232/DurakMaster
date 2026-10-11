import { describe, expect, it } from 'vitest';

import type { TableSnapshot } from '../pick-table-sound.types';

import { pickTableSound } from '../pick-table-sound';

const EMPTY: TableSnapshot = { tableSize: 0, handSize: 0, beaten: 0, discardCount: 0 };

describe('pickTableSound', () => {
  it('shuffles for the opening deal, not once per card', () => {
    const cue = pickTableSound({
      current: { ...EMPTY, handSize: 6 },
      previous: EMPTY
    });

    expect(cue).toEqual({ sound: 'shuffle', repeat: 1 });
  });

  it('plays one deal per card drawn mid-game', () => {
    const cue = pickTableSound({
      current: { ...EMPTY, handSize: 6 },
      previous: { ...EMPTY, handSize: 3 }
    });

    expect(cue).toEqual({ sound: 'deal', repeat: 3 });
  });

  it('tells an attack apart from a card being covered', () => {
    const attack = pickTableSound({
      current: { ...EMPTY, tableSize: 1, handSize: 5 },
      previous: { ...EMPTY, handSize: 6 }
    });

    const defence = pickTableSound({
      current: { ...EMPTY, tableSize: 1, handSize: 6, beaten: 1 },
      previous: { ...EMPTY, tableSize: 1, handSize: 6 }
    });

    expect(attack?.sound).toBe('play');
    expect(defence?.sound).toBe('beat');
  });

  it('takes when the table cleared without reaching the discard', () => {
    const cue = pickTableSound({
      current: { ...EMPTY, handSize: 8, discardCount: 4 },
      previous: { ...EMPTY, tableSize: 2, handSize: 6, discardCount: 4 }
    });

    expect(cue?.sound).toBe('take');
  });

  it('passes when the beaten bout went to the discard', () => {
    const cue = pickTableSound({
      current: { ...EMPTY, handSize: 6, discardCount: 4 },
      previous: { ...EMPTY, tableSize: 2, handSize: 6, beaten: 2 }
    });

    expect(cue?.sound).toBe('pass');
  });

  it('passes even when the hand refilled from the talon in the same update', () => {
    const cue = pickTableSound({
      current: { ...EMPTY, handSize: 6, discardCount: 4 },
      previous: { ...EMPTY, tableSize: 2, handSize: 4, beaten: 2 }
    });

    expect(cue?.sound).toBe('pass');
  });

  it('stays silent when nothing changed', () => {
    expect(pickTableSound({ current: EMPTY, previous: EMPTY })).toBeNull();
  });
});
