import type { GameId } from '@durak-master/schemas';

export type RulesPanelProps = {
  isOpen: boolean;

  game?: GameId;
  onClose: () => void;
};
