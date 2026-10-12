import { BOOST_PRICE } from '@durak-master/schemas';

import type { BoostBlocker, PickBoostBlockerInput } from './pick-boost-blocker.types';

export const pickBoostBlocker = ({
  boost,
  coins,
  canUndo
}: PickBoostBlockerInput): BoostBlocker | null => {
  if (coins < BOOST_PRICE[boost]) {
    return 'notEnoughCoins';
  }

  if (boost === 'undoMove' && !canUndo) {
    return 'nothingToUndo';
  }

  return null;
};
