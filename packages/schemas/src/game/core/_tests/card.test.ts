import { describe, expect, it } from 'vitest';

import { cardSchema, isJoker } from '../card';

describe('cardSchema', () => {
  it('reads a plain card and a joker', () => {
    expect(cardSchema.parse({ kind: 'plain', rank: 'ace', suit: 'spades' })).toEqual({
      kind: 'plain',
      rank: 'ace',
      suit: 'spades'
    });
    expect(cardSchema.parse({ kind: 'joker', color: 'red' })).toEqual({
      kind: 'joker',
      color: 'red'
    });
  });

  it('gives a joker no rank or suit, even when the payload sends them', () => {
    const joker = cardSchema.parse({ kind: 'joker', color: 'black', rank: 'ace', suit: 'spades' });

    expect(joker).toEqual({ kind: 'joker', color: 'black' });
  });

  it('refuses a joker dressed as the ace of spades', () => {
    expect(cardSchema.safeParse({ rank: 'ace', suit: 'spades', joker: 'red' }).success).toBe(false);
  });

  it('refuses a plain card without a suit', () => {
    expect(cardSchema.safeParse({ kind: 'plain', rank: 'ace' }).success).toBe(false);
  });
});

describe('isJoker', () => {
  it('narrows a card to its kind', () => {
    const card = cardSchema.parse({ kind: 'joker', color: 'red' });

    expect(isJoker(card)).toBe(true);
    expect(isJoker({ kind: 'plain', rank: 'ace', suit: 'spades' })).toBe(false);
  });
});
