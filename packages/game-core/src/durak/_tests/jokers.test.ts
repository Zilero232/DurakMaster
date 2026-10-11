import type { Card, DurakRules, DurakState, TablePair } from '@durak-master/schemas';

import { DEFAULT_DURAK_RULES, isJoker } from '@durak-master/schemas';
import { describe, expect, it } from 'vitest';

import { buildDeck, cardKey, cardsEqual } from '../../shared';
import { decideBotAction } from '../bot';
import { reduce } from '../reduce';
import { allowedThrowInRanks, beats, canTransfer, isLegalAttackCard } from '../rules';
import { createGame } from '../setup';

const RED_JOKER: Card = { kind: 'joker', color: 'red' };
const BLACK_JOKER: Card = { kind: 'joker', color: 'black' };

const ACE_OF_SPADES: Card = { kind: 'plain', rank: 'ace', suit: 'spades' };
const SIX_OF_HEARTS: Card = { kind: 'plain', rank: 'six', suit: 'hearts' };
const SEVEN_OF_HEARTS: Card = { kind: 'plain', rank: 'seven', suit: 'hearts' };

const rules = (overrides: Partial<DurakRules> = {}): DurakRules => ({
  ...DEFAULT_DURAK_RULES,
  withJokers: true,
  ...overrides
});

const pair = (attack: Card, defense?: Card): TablePair => ({
  attack,
  defense: defense ?? null,
  attackSeat: 0,
  defenseSeat: defense ? 1 : null
});

const createRandomInt = (seed: number): ((maxExclusive: number) => number) => {
  let value = seed;

  return (maxExclusive: number): number => {
    value = (value * 1_103_515_245 + 12_345) % 2_147_483_647;

    return value % maxExclusive;
  };
};

const transferState = (): DurakState => ({
  game: 'durak',
  rules: { ...rules(), mode: 'transfer', allowTransferByShowingTrump: true },
  tableId: 'table',
  phase: 'playing',
  isTaking: false,
  players: [
    { userId: 'a', seat: 0, handCount: 5, isOut: false, outPlace: null, isDisconnected: false },
    { userId: 'b', seat: 1, handCount: 5, isOut: false, outPlace: null, isDisconnected: false },
    { userId: 'c', seat: 2, handCount: 5, isOut: false, outPlace: null, isDisconnected: false }
  ],
  hands: {
    a: [],
    b: [RED_JOKER],
    c: [SIX_OF_HEARTS, SEVEN_OF_HEARTS, { kind: 'plain', rank: 'eight', suit: 'hearts' }]
  },
  talon: [],
  trump: 'spades',
  trumpCard: null,
  table: [pair(ACE_OF_SPADES)],
  discard: [],
  attackerSeat: 0,
  defenderSeat: 1,
  activeSeat: 1,
  attackLimit: 6,
  passedSeats: [],
  shownTrumpSeats: [],
  turnDeadline: null,
  loserUserId: null,
  isDraw: false,
  version: 0
});

describe('joker deck', () => {
  it('adds exactly two jokers, one of each colour', () => {
    const deck = buildDeck(36, true);
    const jokers = deck.filter((card) => isJoker(card));

    expect(deck).toHaveLength(38);
    expect(jokers.map((card) => card.color).sort()).toEqual(['black', 'red']);
  });

  it('leaves the deck untouched when the mode is off', () => {
    expect(buildDeck(36, false)).toHaveLength(36);
  });

  it('gives every card in the deck its own key', () => {
    const deck = buildDeck(36, true);
    const keys = new Set(deck.map(cardKey));

    expect(keys.size).toBe(deck.length);
  });

  it('tells a joker apart from the ace of spades', () => {
    expect(cardsEqual(RED_JOKER, ACE_OF_SPADES)).toBe(false);
    expect(cardsEqual(RED_JOKER, BLACK_JOKER)).toBe(false);
    expect(cardKey(RED_JOKER)).not.toBe(cardKey(ACE_OF_SPADES));
  });

  it('has no rank or suit to read', () => {
    // @ts-expect-error -- a joker carries no rank, the type has to refuse the read
    expect(RED_JOKER.rank).toBeUndefined();
    // @ts-expect-error -- a joker carries no suit, the type has to refuse the read
    expect(RED_JOKER.suit).toBeUndefined();
  });
});

describe('joker in defence', () => {
  it('beats every card, trumps included', () => {
    expect(beats(RED_JOKER, ACE_OF_SPADES, 'spades')).toBe(true);
    expect(beats(RED_JOKER, SIX_OF_HEARTS, 'spades')).toBe(true);
  });

  it('cannot be beaten by anything', () => {
    expect(beats(ACE_OF_SPADES, RED_JOKER, 'spades')).toBe(false);
    expect(beats(BLACK_JOKER, RED_JOKER, 'spades')).toBe(false);
    expect(beats(SIX_OF_HEARTS, RED_JOKER, 'hearts')).toBe(false);
  });
});

describe('joker throw-ins', () => {
  it('opens no rank for throwing in', () => {
    expect(allowedThrowInRanks([pair(RED_JOKER)])).toEqual(new Set());
    expect(allowedThrowInRanks([pair(SIX_OF_HEARTS, RED_JOKER)])).toEqual(new Set(['six']));
  });

  it('lets nothing be thrown in onto a joker attack, not even an ace', () => {
    expect(isLegalAttackCard(ACE_OF_SPADES, [pair(RED_JOKER)], 6)).toBe(false);
  });

  it('opens only the rank of the card it beat', () => {
    const table = [pair(SIX_OF_HEARTS, RED_JOKER)];

    expect(isLegalAttackCard({ kind: 'plain', rank: 'six', suit: 'clubs' }, table, 6)).toBe(true);
    expect(isLegalAttackCard(ACE_OF_SPADES, table, 6)).toBe(false);
  });

  it('cannot be thrown in onto an open bout', () => {
    expect(isLegalAttackCard(RED_JOKER, [pair(SIX_OF_HEARTS)], 6)).toBe(false);
  });

  it('may still open a bout', () => {
    expect(isLegalAttackCard(RED_JOKER, [], 6)).toBe(true);
  });
});

describe('joker transfers', () => {
  it('cannot be used to transfer', () => {
    expect(canTransfer(RED_JOKER, [pair(ACE_OF_SPADES)], 6)).toBe(false);
  });

  it('blocks a transfer of the bout it sits in', () => {
    expect(canTransfer(ACE_OF_SPADES, [pair(RED_JOKER)], 6)).toBe(false);
  });

  it('is refused as a transfer by the reducer', () => {
    const result = reduce(transferState(), 'b', { type: 'transfer', card: RED_JOKER });

    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.error).toBe('TRANSFER_NOT_ALLOWED');
    }
  });

  it('keeps an ace from being transferred onto a joker by the reducer', () => {
    const state = { ...transferState(), table: [pair(RED_JOKER)] };

    state.hands = { ...state.hands, b: [ACE_OF_SPADES] };

    const result = reduce(state, 'b', { type: 'transfer', card: ACE_OF_SPADES });

    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.error).toBe('TRANSFER_NOT_ALLOWED');
    }
  });

  it('leaves an ordinary transfer working', () => {
    expect(
      canTransfer(SEVEN_OF_HEARTS, [pair({ kind: 'plain', rank: 'seven', suit: 'clubs' })], 6)
    ).toBe(true);
  });
});

describe('joker show-trump transfer', () => {
  it('refuses a joker even though it beats every trump', () => {
    const state = transferState();

    const result = reduce(state, 'b', {
      type: 'transferByShowing',
      card: RED_JOKER
    });

    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.error).toBe('TRANSFER_NOT_ALLOWED');
    }
  });

  it('still allows an ordinary trump of the right rank', () => {
    const state = transferState();

    state.hands.b = [ACE_OF_SPADES];

    const result = reduce(state, 'b', {
      type: 'transferByShowing',
      card: ACE_OF_SPADES
    });

    expect(result.ok).toBe(true);
  });
});

describe('joker deal', () => {
  it('keeps a real trump even when the talon would hold only jokers', () => {
    for (let seed = 1; seed <= 800; seed += 1) {
      const state = createGame({
        tableId: 'table',
        settings: {
          game: 'durak',
          bet: 0,
          maxPlayers: 4,
          isPrivate: false,
          speed: 'normal',
          turnTimeoutSeconds: 30,
          rules: rules({ deckSize: 24 })
        },
        userIds: ['a', 'b', 'c', 'd'],
        randomInt: createRandomInt(seed)
      });

      expect(state.trumpCard).not.toBeNull();
    }
  });

  it('never leaves a joker as the trump card', () => {
    for (let seed = 1; seed <= 200; seed += 1) {
      const state = createGame({
        tableId: 'table',
        settings: {
          game: 'durak',
          bet: 0,
          maxPlayers: 2,
          isPrivate: false,
          speed: 'normal',
          turnTimeoutSeconds: 30,
          rules: rules({ deckSize: 24 })
        },
        userIds: ['a', 'b'],
        randomInt: createRandomInt(seed)
      });

      expect(state.trumpCard).not.toBeNull();
      expect(state.talon.filter((card) => isJoker(card)).length).toBeLessThanOrEqual(2);

      const dealt = Object.values(state.hands).flat().length + state.talon.length;

      expect(dealt).toBe(26);
    }
  });
});

describe('joker bot', () => {
  it('takes a joker attack instead of trying to beat it', () => {
    const state = { ...transferState(), rules: rules(), table: [pair(RED_JOKER)] };

    state.hands = { ...state.hands, b: [ACE_OF_SPADES, BLACK_JOKER] };

    expect(decideBotAction(state, 'b')).toEqual({ type: 'take' });
  });

  it('never throws a joker in onto an open bout', () => {
    const state = { ...transferState(), rules: rules(), table: [pair(SIX_OF_HEARTS)] };

    state.hands = { ...state.hands, a: [RED_JOKER, ACE_OF_SPADES] };

    expect(decideBotAction(state, 'a')).toEqual({ type: 'pass' });
  });
});
