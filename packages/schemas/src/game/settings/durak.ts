import { z } from 'zod';

import { deckSizeSchema } from '../card';

export const durakModeSchema = z.enum(['throwIn', 'transfer']);

export type DurakMode = z.infer<typeof durakModeSchema>;

export const throwInScopeSchema = z.enum(['neighbors', 'all']);

export type ThrowInScope = z.infer<typeof throwInScopeSchema>;

export const fairnessSchema = z.enum(['fair', 'cheaters']);

export type Fairness = z.infer<typeof fairnessSchema>;

export const firstMoveSchema = z.enum(['lowestTrump', 'random', 'afterLoser']);

export type FirstMove = z.infer<typeof firstMoveSchema>;

export const MAX_ATTACK_CARDS_PER_BOUT = 6;

export const durakRulesSchema = z.object({
  mode: durakModeSchema,
  deckSize: deckSizeSchema,
  throwInScope: throwInScopeSchema,
  fairness: fairnessSchema,
  allowDraw: z.boolean(),
  firstMove: firstMoveSchema,
  allowTransferByShowingTrump: z.boolean(),
  attackLimit: z.number().int().min(1).max(MAX_ATTACK_CARDS_PER_BOUT)
});

export type DurakRules = z.infer<typeof durakRulesSchema>;

export const DEFAULT_DURAK_RULES: DurakRules = {
  mode: 'throwIn',
  deckSize: 36,
  throwInScope: 'neighbors',
  fairness: 'fair',
  allowDraw: true,
  firstMove: 'lowestTrump',
  allowTransferByShowingTrump: false,
  attackLimit: MAX_ATTACK_CARDS_PER_BOUT
};
