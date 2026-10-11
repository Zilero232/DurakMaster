import type { Card } from '@durak-master/schemas';

export type UseCardDragInput = {
  onAttackWith: (card: Card) => void;
  onDefendWith: (pairIndex: number, card: Card) => void;
  onTransferWith: (card: Card) => void;

  isDefending: boolean;
  beatableWith: (card: Card) => Set<number>;
  canTransfer: (card: Card) => boolean;
};
