import type { Card, Rank, Suit } from '@durak-master/schemas';

import { describe, expect, it } from 'vitest';

import { beats, rankValue } from '../beating';

const card = (rank: Rank, suit: Suit): Card => ({ rank, suit });

const TRUMP: Suit = 'hearts';

describe('rankValue', () => {
  it('orders ranks by position, not by their string form', () => {
    expect(rankValue('ten')).toBeGreaterThan(rankValue('nine'));
    expect(rankValue('jack')).toBeGreaterThan(rankValue('ten'));
    expect(rankValue('ace')).toBeGreaterThan(rankValue('king'));
  });
});

describe('beats', () => {
  it('beats a lower card of the same suit', () => {
    expect(beats(card('king', 'spades'), card('nine', 'spades'), TRUMP)).toBe(true);
  });

  it('does not beat a higher card of the same suit', () => {
    expect(beats(card('nine', 'spades'), card('king', 'spades'), TRUMP)).toBe(false);
  });

  it('does not beat an equal rank', () => {
    expect(beats(card('nine', 'spades'), card('nine', 'spades'), TRUMP)).toBe(false);
  });

  it('never beats across two plain suits', () => {
    expect(beats(card('ace', 'spades'), card('six', 'clubs'), TRUMP)).toBe(false);
  });

  it('beats any plain card with a trump', () => {
    expect(beats(card('six', TRUMP), card('ace', 'spades'), TRUMP)).toBe(true);
  });

  it('never beats a trump with a plain card', () => {
    expect(beats(card('ace', 'spades'), card('six', TRUMP), TRUMP)).toBe(false);
  });

  it('beats a trump only with a higher trump', () => {
    expect(beats(card('king', TRUMP), card('nine', TRUMP), TRUMP)).toBe(true);
    expect(beats(card('nine', TRUMP), card('king', TRUMP), TRUMP)).toBe(false);
  });

  it('compares 10 against a face card by rank order', () => {
    expect(beats(card('jack', 'spades'), card('ten', 'spades'), TRUMP)).toBe(true);
    expect(beats(card('ten', 'spades'), card('jack', 'spades'), TRUMP)).toBe(false);
  });
});
