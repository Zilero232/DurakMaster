import { z } from 'zod';

import { publicProfileSchema } from '../profile/profile';

export const leaderboardEntrySchema = z.object({
  rank: z.number().int().positive(),
  profile: publicProfileSchema
});

export type LeaderboardEntry = z.infer<typeof leaderboardEntrySchema>;

export const leaderboardSchema = z.object({
  entries: z.array(leaderboardEntrySchema),

  myRank: z.number().int().positive().nullable()
});

export type Leaderboard = z.infer<typeof leaderboardSchema>;

export const LEADERBOARD_SIZE = 50;
