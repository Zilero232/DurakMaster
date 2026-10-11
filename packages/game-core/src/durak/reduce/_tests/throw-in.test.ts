import { describe, expect, it } from 'vitest';

import { buildState, card, pair } from '../../_tests/fixture';
import { reduce } from '../index';

const someCards = () => [card('six', 'diamonds'), card('seven', 'diamonds')];

describe('durak throw-in order', () => {
  it('hands the turn clockwise from the main attacker, not from the first seat', () => {
    const state = buildState({
      hands: { a: someCards(), b: someCards(), c: someCards(), d: someCards() },
      table: [pair(card('nine', 'hearts'), card('king', 'hearts'))],
      attackerSeat: 1,
      defenderSeat: 2,
      activeSeat: 1,
      rules: { throwInScope: 'all' }
    });

    const result = reduce(state, 'b', { type: 'pass' });

    expect(result.ok).toBe(true);

    if (!result.ok) {
      return;
    }

    expect(result.state.activeSeat).toBe(3);
  });
});

describe('durak take', () => {
  it('lets seats that passed before the take throw in while the defender takes', () => {
    const state = buildState({
      hands: {
        a: someCards(),
        b: someCards(),
        c: [card('nine', 'clubs'), card('two', 'diamonds')]
      },
      table: [pair(card('nine', 'hearts'))],
      passedSeats: [0, 2],
      activeSeat: 1,
      rules: { throwInScope: 'all' }
    });

    const took = reduce(state, 'b', { type: 'take' });

    expect(took.ok).toBe(true);

    if (!took.ok) {
      return;
    }

    expect(took.state.phase).toBe('playing');
    expect(took.state.isTaking).toBe(true);
    expect(took.state.passedSeats).toEqual([]);
    expect(took.state.activeSeat).toBe(0);

    const thrown = reduce(took.state, 'c', { type: 'attack', card: card('nine', 'clubs') });

    expect(thrown.ok).toBe(true);

    if (!thrown.ok) {
      return;
    }

    expect(thrown.state.table).toHaveLength(2);
  });
});

describe('durak attack limit', () => {
  it('stays at the value fixed when the bout started while the defender’s hand shrinks', () => {
    const state = buildState({
      hands: {
        a: [
          card('nine', 'hearts'),
          card('nine', 'diamonds'),
          card('nine', 'clubs'),
          card('nine', 'spades')
        ],
        b: [card('king', 'hearts'), card('king', 'diamonds'), card('king', 'clubs')]
      },
      attackLimit: 3
    });

    const steps = [
      { userId: 'a', action: { type: 'attack', card: card('nine', 'hearts') } },
      { userId: 'b', action: { type: 'defend', pairIndex: 0, card: card('king', 'hearts') } },
      { userId: 'a', action: { type: 'attack', card: card('nine', 'diamonds') } },
      { userId: 'b', action: { type: 'defend', pairIndex: 1, card: card('king', 'diamonds') } },
      { userId: 'a', action: { type: 'attack', card: card('nine', 'clubs') } }
    ] as const;

    let current = state;

    for (const step of steps) {
      const result = reduce(current, step.userId, step.action);

      expect(result.ok).toBe(true);

      if (!result.ok) {
        return;
      }

      current = result.state;
    }

    expect(current.hands.b).toHaveLength(1);
    expect(current.table).toHaveLength(3);

    const overLimit = reduce(current, 'a', { type: 'attack', card: card('nine', 'spades') });

    expect(overLimit).toEqual({ ok: false, error: 'ATTACK_LIMIT_REACHED' });
  });
});
