import type { Card, Suit } from '@durak-master/schemas';

import { MARRIAGE_POINTS } from '@durak-master/schemas';

export const marriageSuits = (hand: Card[]): Suit[] => {
  const kings = new Set(hand.filter((card) => card.rank === 'king').map((card) => card.suit));

  return hand
    .filter((card) => card.rank === 'queen' && kings.has(card.suit))
    .map((card) => card.suit);
};

export const bidCeiling = (hand: Card[]): number =>
  marriageSuits(hand).reduce((total, suit) => total + MARRIAGE_POINTS[suit], 120);
