import type { Card, KozelRules, Suit } from '@durak-master/schemas';

import { DEFAULT_KOZEL_RULES, KOZEL_TOTAL_POINTS } from '@durak-master/schemas';
import { describe, expect, it } from 'bun:test';

import { buildDeck } from '../shared';
import {
  cardPoints,
  effectiveSuit,
  handPoints,
  isTrump,
  legalCards,
  plainStrength,
  trickWinnerIndex,
  trumpStrength
} from './rules';

const card = (rank: Card['rank'], suit: Suit): Card => ({ rank, suit });

const RULES: KozelRules = DEFAULT_KOZEL_RULES;
const SCHAFKOPF: KozelRules = { ...DEFAULT_KOZEL_RULES, shamokIsHighest: false };

const noUnled = new Set<Suit>();
const allUnled = new Set<Suit>(['spades', 'hearts', 'diamonds']);

const legal = (
  hand: Card[],
  trick: Card[],
  overrides: Partial<Parameters<typeof legalCards>[0]> = {}
) =>
  legalCards({
    hand,
    trick,
    rules: RULES,
    isFirstTrick: false,
    unledSuits: noUnled,
    ...overrides
  });

describe('effectiveSuit', () => {
  it('treats queens, jacks and every club as trumps', () => {
    expect(effectiveSuit(card('queen', 'diamonds'))).toBe('trump');
    expect(effectiveSuit(card('jack', 'hearts'))).toBe('trump');
    expect(effectiveSuit(card('seven', 'clubs'))).toBe('trump');
    expect(effectiveSuit(card('ace', 'clubs'))).toBe('trump');
  });

  it('leaves plain cards in their own suit', () => {
    expect(effectiveSuit(card('ace', 'spades'))).toBe('spades');
    expect(effectiveSuit(card('ten', 'hearts'))).toBe('hearts');
  });

  it('counts exactly 14 trumps in the deck', () => {
    const trumps = buildDeck(32).filter(isTrump);

    expect(trumps).toHaveLength(14);
  });
});

describe('trump order', () => {
  it('makes the shamok the strongest and the eight of clubs the weakest', () => {
    const order = [
      card('seven', 'clubs'),
      card('queen', 'clubs'),
      card('queen', 'spades'),
      card('queen', 'hearts'),
      card('queen', 'diamonds'),
      card('jack', 'clubs'),
      card('jack', 'spades'),
      card('jack', 'hearts'),
      card('jack', 'diamonds'),
      card('ace', 'clubs'),
      card('ten', 'clubs'),
      card('king', 'clubs'),
      card('nine', 'clubs'),
      card('eight', 'clubs')
    ];

    const strengths = order.map((entry) => trumpStrength(entry, RULES));

    expect(strengths).toEqual([...strengths].sort((a, b) => a - b));
    expect(new Set(strengths).size).toBe(order.length);
  });

  it('drops the shamok to the bottom in the Schafkopf variant', () => {
    expect(trumpStrength(card('seven', 'clubs'), SCHAFKOPF)).toBeGreaterThan(
      trumpStrength(card('eight', 'clubs'), SCHAFKOPF)
    );
    expect(trumpStrength(card('queen', 'clubs'), SCHAFKOPF)).toBe(0);
  });
});

describe('plain order', () => {
  it('puts the ten above the king', () => {
    expect(plainStrength(card('ten', 'hearts'))).toBeGreaterThan(
      plainStrength(card('king', 'hearts'))
    );
    expect(plainStrength(card('ace', 'hearts'))).toBeGreaterThan(
      plainStrength(card('ten', 'hearts'))
    );
  });
});

describe('card points', () => {
  it('keeps value and strength apart', () => {
    // The strongest card in the game is worth nothing.
    expect(cardPoints(card('seven', 'clubs'))).toBe(0);
    // A weak trump carries the most points.
    expect(cardPoints(card('ace', 'diamonds'))).toBe(11);
  });

  it('holds exactly 120 points in the deck', () => {
    expect(handPoints(buildDeck(32))).toBe(KOZEL_TOTAL_POINTS);
  });
});

describe('trickWinnerIndex', () => {
  it('gives the trick to the strongest trump', () => {
    const cards = [
      card('ace', 'hearts'),
      card('jack', 'diamonds'),
      card('queen', 'diamonds'),
      card('ten', 'hearts')
    ];

    expect(trickWinnerIndex(cards, RULES)).toBe(2);
  });

  it('never lets a discard of a foreign suit win', () => {
    const cards = [
      card('seven', 'hearts'),
      card('ace', 'spades'),
      card('eight', 'hearts'),
      card('ten', 'diamonds')
    ];

    // The ace of spades is the highest card on the table and still loses.
    expect(trickWinnerIndex(cards, RULES)).toBe(2);
  });

  it('ranks a trump lead among trumps only', () => {
    const cards = [
      card('jack', 'diamonds'),
      card('nine', 'clubs'),
      card('queen', 'hearts'),
      card('eight', 'clubs')
    ];

    expect(trickWinnerIndex(cards, RULES)).toBe(2);
  });

  it('lets the shamok beat the queen of clubs', () => {
    const cards = [card('queen', 'clubs'), card('seven', 'clubs')];

    expect(trickWinnerIndex(cards, RULES)).toBe(1);
    expect(trickWinnerIndex(cards, SCHAFKOPF)).toBe(0);
  });
});

describe('legalCards', () => {
  it('forces following the led plain suit', () => {
    const hand = [card('seven', 'hearts'), card('ace', 'spades'), card('queen', 'hearts')];
    const allowed = legal(hand, [card('ten', 'hearts')]);

    // The queen of hearts is a trump, not a heart — it does not follow.
    expect(allowed).toEqual([card('seven', 'hearts')]);
  });

  it('counts a hand whose only heart is the queen of hearts as void in hearts', () => {
    const hand = [card('queen', 'hearts'), card('ace', 'spades')];
    const allowed = legal(hand, [card('ten', 'hearts')]);

    expect(allowed).toHaveLength(2);
  });

  it('answers a queen lead with trumps, not with the painted suit', () => {
    const hand = [card('ace', 'diamonds'), card('jack', 'spades'), card('ten', 'diamonds')];
    const allowed = legal(hand, [card('queen', 'diamonds')]);

    expect(allowed).toEqual([card('jack', 'spades')]);
  });

  it('never requires beating what is already on the table', () => {
    const hand = [card('seven', 'spades'), card('ace', 'spades')];
    const allowed = legal(hand, [card('ten', 'spades')]);

    expect(allowed).toHaveLength(2);
  });

  it('never requires trumping when out of the led suit', () => {
    const hand = [card('queen', 'clubs'), card('seven', 'diamonds')];
    const allowed = legal(hand, [card('ten', 'spades')]);

    expect(allowed).toHaveLength(2);
  });

  it('bans opening the first trick on a trump while a plain card is held', () => {
    const hand = [card('queen', 'clubs'), card('seven', 'diamonds')];
    const allowed = legal(hand, [], { isFirstTrick: true });

    expect(allowed).toEqual([card('seven', 'diamonds')]);
  });

  it('lifts that ban for an all-trump hand', () => {
    const hand = [card('queen', 'clubs'), card('jack', 'hearts')];
    const allowed = legal(hand, [], { isFirstTrick: true });

    expect(allowed).toHaveLength(2);
  });

  it('leaves later tricks free to open on a trump', () => {
    const hand = [card('queen', 'clubs'), card('seven', 'diamonds')];
    const allowed = legal(hand, [], { isFirstTrick: false });

    expect(allowed).toHaveLength(2);
  });

  it('holds back an ace of an unled suit only when the restriction is on', () => {
    const hand = [card('ace', 'diamonds'), card('seven', 'hearts')];
    const trick = [card('ten', 'spades')];

    expect(legal(hand, trick, { unledSuits: allUnled })).toHaveLength(2);

    const restricted = legalCards({
      hand,
      trick,
      rules: { ...RULES, aceDiscardRestriction: true },
      isFirstTrick: false,
      unledSuits: allUnled
    });

    expect(restricted).toEqual([card('seven', 'hearts')]);
  });
});
