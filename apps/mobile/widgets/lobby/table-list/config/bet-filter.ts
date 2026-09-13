import { BET_STEPS } from '@durak-master/schemas';

const LOW_MAX = BET_STEPS[2] ?? 1_000;

const MID_MAX = BET_STEPS[5] ?? 50_000;

export type BetFilter = 'all' | 'high' | 'low' | 'mid';

export const BET_BRACKETS = { low: LOW_MAX, mid: MID_MAX } as const;
