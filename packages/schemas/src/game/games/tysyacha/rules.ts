import { z } from 'zod';

export const twoPlayerModeSchema = z.enum(['auction', 'draw']);

export type TwoPlayerMode = z.infer<typeof twoPlayerModeSchema>;

export const discardVisibilitySchema = z.enum(['open', 'closed']);

export type DiscardVisibility = z.infer<typeof discardVisibilitySchema>;

export const skipBonusSchema = z.enum(['none', 'aces', 'fixed30']);

export type SkipBonus = z.infer<typeof skipBonusSchema>;

export const TYSYACHA_WINNING_SCORES = [1000, 1001] as const;

export const TYSYACHA_BARREL_SCORE = 880;

export const MIN_BID = 100;

export const barrelMinBid = (winningScore: number): number => winningScore - TYSYACHA_BARREL_SCORE;

export const tysyachaRulesSchema = z.object({
  twoPlayerMode: twoPlayerModeSchema,
  bidStep: z.union([z.literal(5), z.literal(10)]),
  roundingStep: z.union([z.literal(5), z.literal(10)]),
  marriageOnFirstTrick: z.boolean(),
  discardVisibility: discardVisibilitySchema,
  boltsMustBeConsecutive: z.boolean(),
  barrelAttemptsCountAllDeals: z.boolean(),
  winningScore: z.union([z.literal(1000), z.literal(1001)]),
  dumpTruck: z.boolean(),
  skipBonus: skipBonusSchema
});

export type TysyachaRules = z.infer<typeof tysyachaRulesSchema>;

export const DEFAULT_TYSYACHA_RULES: TysyachaRules = {
  twoPlayerMode: 'auction',
  bidStep: 5,
  roundingStep: 5,
  marriageOnFirstTrick: false,
  discardVisibility: 'closed',
  boltsMustBeConsecutive: false,
  barrelAttemptsCountAllDeals: true,
  winningScore: 1000,
  dumpTruck: false,
  skipBonus: 'none'
};
