import type { DurakDeckSize, DurakRules } from '@durak-master/schemas';

import { DEFAULT_DURAK_RULES, isJoker } from '@durak-master/schemas';
import { describe, expect, it } from 'vitest';

import { createGame } from '../create-game';

type DealInput = {
  deckSize: DurakDeckSize;
  players: number;
  randomInt: (maxExclusive: number) => number;
  rules?: Partial<DurakRules>;
};

const createRandomInt = (seed: number): ((maxExclusive: number) => number) => {
  let value = seed;

  return (maxExclusive: number): number => {
    value = (value * 1_103_515_245 + 12_345) % 2_147_483_647;

    return value % maxExclusive;
  };
};

const keepOrder = (maxExclusive: number): number => maxExclusive - 1;

const deal = ({ deckSize, players, randomInt, rules }: DealInput) =>
  createGame({
    tableId: 'table',
    settings: {
      game: 'durak',
      bet: 0,
      maxPlayers: players,
      isPrivate: false,
      speed: 'normal',
      turnTimeoutSeconds: 30,
      rules: { ...DEFAULT_DURAK_RULES, deckSize, ...rules }
    },
    userIds: Array.from({ length: players }, (_, index) => `p${index}`),
    randomInt
  });

describe('durak deal', () => {
  it.each([
    { deckSize: 36 as const, players: 6 },
    { deckSize: 24 as const, players: 4 }
  ])(
    'turns up the last dealt card as trump when $players players take the whole $deckSize-card deck',
    ({ deckSize, players }) => {
      for (let seed = 1; seed <= 20; seed += 1) {
        const state = deal({ deckSize, players, randomInt: createRandomInt(seed) });
        const lastHand = state.hands[`p${players - 1}`] ?? [];

        expect(state.talon).toHaveLength(0);
        expect(state.trumpCard).not.toBeNull();
        expect(state.trumpCard?.suit).toBe(state.trump);
        expect(lastHand.at(-1)).toEqual(state.trumpCard);
      }
    }
  );

  it('swaps a joker at the bottom with the nearest ordinary card, not the first player’s card', () => {
    const state = deal({
      deckSize: 24,
      players: 2,
      randomInt: keepOrder,
      rules: { withJokers: true }
    });

    expect(state.hands.p0?.[0]).toEqual({ kind: 'plain', rank: 'nine', suit: 'spades' });
    expect(state.trumpCard).toEqual({ kind: 'plain', rank: 'ace', suit: 'clubs' });
    expect(state.talon.filter((card) => isJoker(card))).toHaveLength(2);
    expect(Object.values(state.hands).flat().length + state.talon.length).toBe(26);
  });
});
