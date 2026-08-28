import { z } from 'zod';

export const durakModeSchema = z.enum(['throwIn', 'transfer']);

export type DurakMode = z.infer<typeof durakModeSchema>;

export const throwInScopeSchema = z.enum(['neighbors', 'all']);

export type ThrowInScope = z.infer<typeof throwInScopeSchema>;

export const fairnessSchema = z.enum(['fair', 'cheaters']);

export type Fairness = z.infer<typeof fairnessSchema>;

export const firstMoveSchema = z.enum(['lowestTrump', 'random']);

export type FirstMove = z.infer<typeof firstMoveSchema>;

export const DURAK_DECK_SIZES = [24, 36, 52] as const;

export const durakDeckSizeSchema = z.union([z.literal(24), z.literal(36), z.literal(52)]);

export type DurakDeckSize = z.infer<typeof durakDeckSizeSchema>;

export const MAX_ATTACK_CARDS_PER_BOUT = 6;

export const DURAK_HAND_SIZE = 6;

export function maxDurakPlayers(deckSize: DurakDeckSize): number {
  return Math.floor(deckSize / DURAK_HAND_SIZE);
}

export const durakRulesSchema = z.object({
  mode: durakModeSchema,
  deckSize: durakDeckSizeSchema,
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
