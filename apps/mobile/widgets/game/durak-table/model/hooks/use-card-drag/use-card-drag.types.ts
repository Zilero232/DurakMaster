import type { Card } from '@durak-master/schemas';

export type UseCardDragInput = {
  onDefendWith: (pairIndex: number, card: Card) => void;
  onAttackWith: (card: Card) => void;

  isDefending: boolean;
  beatableWith: (card: Card) => Set<number>;
};
