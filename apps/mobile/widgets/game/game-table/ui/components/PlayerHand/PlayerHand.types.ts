import type { Card, Suit } from '@durak-master/schemas';

export type PlayerHandProps = {
  cards: Card[];
  playableKeys: Set<string>;
  selectedKey: string | null;
  trump: Suit;
  onSelect: (card: Card) => void;
};
