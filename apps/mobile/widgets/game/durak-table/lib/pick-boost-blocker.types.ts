import type { BoostId } from '@durak-master/schemas';

export type BoostBlocker = 'notEnoughCoins' | 'nothingToUndo';

export type PickBoostBlockerInput = {
  boost: BoostId;
  coins: number;
  canUndo: boolean;
};
