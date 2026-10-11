import { describe, expect, it } from 'vitest';

import { buildState, card, pair } from '../../_tests/fixture';
import { reduce } from '../index';

const TRUMP_ACE = card('ace', 'spades');

describe('durak drawing', () => {
  it('fills each player up to six before the next one draws', () => {
    const state = buildState({
      hands: {
        a: [card('seven', 'hearts'), card('eight', 'hearts'), card('nine', 'hearts')],
        b: [
          card('six', 'hearts'),
          card('queen', 'clubs'),
          card('king', 'clubs'),
          card('ace', 'clubs')
        ]
      },
      table: [pair(card('ten', 'clubs'), card('jack', 'clubs'))],
      talon: [card('six', 'clubs'), card('seven', 'diamonds'), TRUMP_ACE],
      trumpCard: TRUMP_ACE
    });

    const result = reduce(state, 'a', { type: 'pass' });

    expect(result.ok).toBe(true);

    if (!result.ok) {
      return;
    }

    expect(result.state.hands.a).toHaveLength(6);
    expect(result.state.hands.a).toContainEqual(TRUMP_ACE);
    expect(result.state.hands.b).toHaveLength(4);
    expect(result.state.talon).toHaveLength(0);
  });
});

describe('durak end of the deal', () => {
  const lastBout = (allowDraw: boolean) =>
    buildState({
      hands: { a: [], b: [] },
      table: [pair(card('nine', 'hearts'), card('king', 'hearts'))],
      rules: { allowDraw }
    });

  it('calls a draw when nobody holds cards and draws are allowed', () => {
    const result = reduce(lastBout(true), 'a', { type: 'pass' });

    expect(result.ok).toBe(true);

    if (!result.ok) {
      return;
    }

    expect(result.state.phase).toBe('finished');
    expect(result.state.isDraw).toBe(true);
    expect(result.state.loserUserId).toBeNull();
  });

  it('makes the defender of the last bout the loser when draws are off', () => {
    const result = reduce(lastBout(false), 'a', { type: 'pass' });

    expect(result.ok).toBe(true);

    if (!result.ok) {
      return;
    }

    expect(result.state.phase).toBe('finished');
    expect(result.state.isDraw).toBe(false);
    expect(result.state.loserUserId).toBe('b');
  });
});
