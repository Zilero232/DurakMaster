import { z } from 'zod';

export const kozelDealModeSchema = z.enum(['eightAtOnce', 'fourWithDraw']);

export type KozelDealMode = z.infer<typeof kozelDealModeSchema>;

export const kozelFirstLeadSchema = z.enum(['lowestTrump', 'leftOfDealer', 'dealer']);

export type KozelFirstLead = z.infer<typeof kozelFirstLeadSchema>;

export const KOZEL_TARGET_PAIRS = 6;

export const KOZEL_WINNING_POINTS = 61;

export const KOZEL_TOTAL_POINTS = 120;

export const kozelRulesSchema = z.object({
  shamokIsHighest: z.boolean(),
  dealMode: kozelDealModeSchema,
  firstLead: kozelFirstLeadSchema,
  aceDiscardRestriction: z.boolean(),
  royalKozel: z.boolean(),
  lastTrumpExchange: z.boolean(),
  targetPairs: z.number().int().min(3).max(12)
});

export type KozelRules = z.infer<typeof kozelRulesSchema>;

export const DEFAULT_KOZEL_RULES: KozelRules = {
  shamokIsHighest: true,
  dealMode: 'eightAtOnce',
  firstLead: 'lowestTrump',
  aceDiscardRestriction: false,
  royalKozel: false,
  lastTrumpExchange: false,
  targetPairs: KOZEL_TARGET_PAIRS
};
