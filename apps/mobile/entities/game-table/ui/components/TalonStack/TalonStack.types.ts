import type { Card, Suit } from '@durak-master/schemas';

export type TalonStackProps = {
  cardWidth: number;
  count: number;
  trump: Suit;
  trumpCard: Card | null;
};
