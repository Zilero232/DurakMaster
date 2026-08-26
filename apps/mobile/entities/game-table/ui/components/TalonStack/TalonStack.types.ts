import type { Card, Suit } from '@durak-master/schemas';

export type TalonStackProps = {
  count: number;
  trump: Suit;
  trumpCard: Card | null;
};
