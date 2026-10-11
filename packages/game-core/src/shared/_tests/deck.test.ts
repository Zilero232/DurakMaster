import { isJoker } from '@durak-master/schemas';
import { describe, expect, it } from 'vitest';

import { buildDeck, cardKey } from '../deck';

describe('buildDeck', () => {
  it.each([
    { deckSize: 24 as const, lowest: 'nine' },
    { deckSize: 36 as const, lowest: 'six' },
    { deckSize: 52 as const, lowest: 'two' }
  ])('builds $deckSize cards starting at $lowest', ({ deckSize, lowest }) => {
    const plainCards = buildDeck(deckSize).filter((card) => !isJoker(card));

    expect(plainCards).toHaveLength(deckSize);
    expect(plainCards.filter((card) => card.rank === lowest)).toHaveLength(4);
    expect(new Set(plainCards.map((card) => card.suit)).size).toBe(4);
  });

  it.each([24 as const, 36 as const, 52 as const])(
    'adds exactly two jokers to the %i-card deck',
    (deckSize) => {
      const deck = buildDeck(deckSize, true);

      expect(deck).toHaveLength(deckSize + 2);
      expect(deck.filter((card) => isJoker(card)).map((card) => cardKey(card))).toEqual([
        'joker:red',
        'joker:black'
      ]);
    }
  );
});
