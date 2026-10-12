import type { BoostId } from '@durak-master/schemas';

export type UseBoostConfirmInput = {
  coins: number;
  canUndo: boolean;
  onUseBoost: (boost: BoostId) => void;
};
