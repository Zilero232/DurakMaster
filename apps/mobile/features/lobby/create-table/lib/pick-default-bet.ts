import { BET_STEPS, MIN_BET } from '@durak-master/schemas';

import { PREFERRED_BET } from '../config';

export const pickDefaultBet = (credits: number): number => {
  const ceiling = Math.min(credits, PREFERRED_BET);

  return [...BET_STEPS].reverse().find((step) => step <= ceiling) ?? MIN_BET;
};
