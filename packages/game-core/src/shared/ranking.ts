import type { Card, Rank } from '@durak-master/schemas';

export const rankValueIn =
  (order: readonly Rank[]) =>
  (card: Card): number =>
    order.indexOf(card.rank);
