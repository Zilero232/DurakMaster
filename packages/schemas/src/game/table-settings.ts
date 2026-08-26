import { z } from 'zod';

import { deckSizeSchema } from './card';

export const gameModeSchema = z.enum(['throwIn', 'transfer']);
export type GameMode = z.infer<typeof gameModeSchema>;

export const throwInScopeSchema = z.enum(['neighbors', 'all']);
export type ThrowInScope = z.infer<typeof throwInScopeSchema>;

export const fairnessSchema = z.enum(['fair', 'cheaters']);
export type Fairness = z.infer<typeof fairnessSchema>;

export const gameSpeedSchema = z.enum(['normal', 'fast']);
export type GameSpeed = z.infer<typeof gameSpeedSchema>;

export const MIN_PLAYERS = 2;
export const MAX_PLAYERS = 6;

export const MAX_ATTACK_CARDS_PER_BOUT = 6;

export const TURN_SECONDS_BY_SPEED: Record<GameSpeed, number> = {
  normal: 30,
  fast: 15
};

export const tableSettingsSchema = z.object({
  mode: gameModeSchema,
  deckSize: deckSizeSchema,
  maxPlayers: z.number().int().min(MIN_PLAYERS).max(MAX_PLAYERS),

  throwInScope: throwInScopeSchema,

  fairness: fairnessSchema,

  speed: gameSpeedSchema,

  allowDraw: z.boolean(),

  isClassic: z.boolean(),

  allowTransferByShowingTrump: z.boolean(),

  bet: z.number().int().nonnegative(),

  isPrivate: z.boolean(),

  turnTimeoutSeconds: z.number().int().min(5).max(120)
});

export type TableSettings = z.infer<typeof tableSettingsSchema>;

export const DEFAULT_TABLE_SETTINGS: TableSettings = {
  mode: 'throwIn',
  deckSize: 36,
  maxPlayers: 4,
  throwInScope: 'neighbors',
  fairness: 'fair',
  speed: 'normal',
  allowDraw: true,
  isClassic: true,
  allowTransferByShowingTrump: false,
  bet: 100,
  isPrivate: false,
  turnTimeoutSeconds: TURN_SECONDS_BY_SPEED.normal
};

export const BET_STEPS = [
  100, 500, 1_000, 5_000, 10_000, 50_000, 100_000, 500_000, 1_000_000, 10_000_000
] as const;
