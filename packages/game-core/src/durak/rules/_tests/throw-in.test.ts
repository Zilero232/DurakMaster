import type { DurakState, TablePair, ThrowInScope } from '@durak-master/schemas';

import { describe, expect, it } from 'vitest';

import { allowedThrowInRanks, canThrowIn } from '../throw-in';

const pair = (attack: TablePair['attack'], defense: TablePair['defense'] = null): TablePair =>
  ({ attack, defense }) as TablePair;

type ThrowInState = Pick<DurakState, 'attackerSeat' | 'defenderSeat' | 'players' | 'rules'>;

const stateWith = (scope: ThrowInScope, seatCount = 4, outSeats: number[] = []): ThrowInState =>
  ({
    attackerSeat: 0,
    defenderSeat: 1,
    rules: { throwInScope: scope },
    players: Array.from({ length: seatCount }, (_, seat) => ({
      userId: `p${seat}`,
      seat,
      isOut: outSeats.includes(seat)
    }))
  }) as ThrowInState;

describe('allowedThrowInRanks', () => {
  it('opens the rank of an attacking card', () => {
    expect(allowedThrowInRanks([pair({ rank: 'nine', suit: 'spades' })])).toEqual(
      new Set(['nine'])
    );
  });

  it('also opens the rank the defender beat with — the rule most often missed', () => {
    const ranks = allowedThrowInRanks([
      pair({ rank: 'nine', suit: 'spades' }, { rank: 'king', suit: 'spades' })
    ]);

    expect(ranks).toEqual(new Set(['nine', 'king']));
  });

  it('collects ranks across every pair on the table', () => {
    const ranks = allowedThrowInRanks([
      pair({ rank: 'nine', suit: 'spades' }, { rank: 'king', suit: 'spades' }),
      pair({ rank: 'six', suit: 'clubs' })
    ]);

    expect(ranks).toEqual(new Set(['nine', 'king', 'six']));
  });

  it('is empty on an empty table', () => {
    expect(allowedThrowInRanks([])).toEqual(new Set());
  });
});

describe('canThrowIn', () => {
  it('never lets the defender throw in', () => {
    expect(canThrowIn(1, stateWith('all'))).toBe(false);
  });

  it('always lets the main attacker throw in', () => {
    expect(canThrowIn(0, stateWith('neighbors'))).toBe(true);
  });

  it('never lets a player who is out throw in', () => {
    expect(canThrowIn(2, stateWith('all', 4, [2]))).toBe(false);
  });

  it('lets any seat throw in when the scope is "all"', () => {
    expect(canThrowIn(2, stateWith('all'))).toBe(true);
    expect(canThrowIn(3, stateWith('all'))).toBe(true);
  });

  it('limits "neighbors" to the seats either side of the defender', () => {
    expect(canThrowIn(2, stateWith('neighbors'))).toBe(true);
    expect(canThrowIn(3, stateWith('neighbors', 5))).toBe(false);
  });

  it('wraps the neighbour seats around the table', () => {
    const state = { ...stateWith('neighbors', 4), attackerSeat: 2, defenderSeat: 0 };

    expect(canThrowIn(3, state)).toBe(true);
    expect(canThrowIn(1, state)).toBe(true);
  });

  it('refuses a seat that is not at the table', () => {
    expect(canThrowIn(9, stateWith('all'))).toBe(false);
  });
});
