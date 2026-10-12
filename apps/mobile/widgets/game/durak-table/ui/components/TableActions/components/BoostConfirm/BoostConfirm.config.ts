import type { ParseKeys } from 'i18next';

import type { BoostBlocker } from '../../../../../lib';

export const BLOCKER_LABELS: Record<BoostBlocker, ParseKeys> = {
  notEnoughCoins: 'boosts.notEnoughCoins',
  nothingToUndo: 'boosts.nothingToUndo'
};
