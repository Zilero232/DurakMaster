import type { BoostId, Card } from '@durak-master/schemas';

export type RevealedCardsProps = {
  boost: BoostId | null;
  cards: Card[];
  onClose: () => void;
};
