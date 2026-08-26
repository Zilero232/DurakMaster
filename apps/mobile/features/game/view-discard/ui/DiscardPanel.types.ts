import type { Card } from '@durak-master/schemas';

export type DiscardPanelProps = {
  isOpen: boolean;
  cards: Card[];
  onClose: () => void;
};
