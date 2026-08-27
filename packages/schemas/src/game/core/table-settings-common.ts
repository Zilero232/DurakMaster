import { z } from 'zod';

export const gameSpeedSchema = z.enum(['normal', 'fast']);

export type GameSpeed = z.infer<typeof gameSpeedSchema>;

export const TURN_SECONDS_BY_SPEED: Record<GameSpeed, number> = {
  normal: 30,
  fast: 15
};

export const BET_STEPS = [
  100, 500, 1_000, 5_000, 10_000, 50_000, 100_000, 500_000, 1_000_000, 10_000_000
] as const;

export const commonTableSettingsSchema = z.object({
  maxPlayers: z.number().int().min(2).max(6),
  bet: z.number().int().nonnegative(),
  isPrivate: z.boolean(),
  speed: gameSpeedSchema,
  turnTimeoutSeconds: z.number().int().min(5).max(120)
});

export type CommonTableSettings = z.infer<typeof commonTableSettingsSchema>;

export const DEFAULT_COMMON_SETTINGS: CommonTableSettings = {
  maxPlayers: 4,
  bet: 100,
  isPrivate: false,
  speed: 'normal',
  turnTimeoutSeconds: TURN_SECONDS_BY_SPEED.normal
};
