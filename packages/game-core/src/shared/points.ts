import type { Card, Rank } from '@durak-master/schemas';

export const cardPointsIn =
  (table: Partial<Record<Rank, number>>) =>
  (card: Card): number =>
    table[card.rank] ?? 0;

export const sumPoints = (cards: readonly Card[], cardPoints: (card: Card) => number): number =>
  cards.reduce((total, card) => total + cardPoints(card), 0);
