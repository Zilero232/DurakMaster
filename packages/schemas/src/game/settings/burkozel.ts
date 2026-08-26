import { z } from 'zod';

export const burkozelTeamModeSchema = z.enum(['solo', 'pairs']);

export type BurkozelTeamMode = z.infer<typeof burkozelTeamModeSchema>;

export const PENALTY_LIMITS = [6, 12, 24] as const;

export const PENALTY_FREE_THRESHOLD = {
  twoSided: 31,
  threeWay: 21
} as const;

export const burkozelRulesSchema = z.object({
  teamMode: burkozelTeamModeSchema,
  shokhaEnabled: z.boolean(),
  combinationsEnabled: z.boolean(),
  penaltyLimit: z.number().int().min(6).max(24)
});

export type BurkozelRules = z.infer<typeof burkozelRulesSchema>;

export const DEFAULT_BURKOZEL_RULES: BurkozelRules = {
  teamMode: 'solo',
  shokhaEnabled: true,
  combinationsEnabled: true,
  penaltyLimit: 12
};
