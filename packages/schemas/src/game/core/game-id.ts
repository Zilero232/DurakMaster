import { z } from 'zod';

export const GAME_IDS = ['durak', 'burkozel', 'kozel', 'tysyacha'] as const;

export const gameIdSchema = z.enum(GAME_IDS);

export type GameId = z.infer<typeof gameIdSchema>;

export const DEFAULT_GAME: GameId = 'durak';

export const PLAYER_RANGE_BY_GAME: Record<GameId, { min: number; max: number }> = {
  durak: { min: 2, max: 6 },
  burkozel: { min: 2, max: 4 },
  kozel: { min: 4, max: 4 },
  tysyacha: { min: 3, max: 3 }
};
