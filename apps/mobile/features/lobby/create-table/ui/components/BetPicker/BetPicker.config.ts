import { BET_STEPS } from '@durak-master/schemas';

export const BET_SHORTCUTS = [BET_STEPS[0], BET_STEPS[2], BET_STEPS[4], BET_STEPS[6]] as const;

export const LAST_INDEX = BET_STEPS.length - 1;
