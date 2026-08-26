import { z } from 'zod';

export const ACHIEVEMENTS = [
  { id: 'firstGame', target: 1, reward: 5 },
  { id: 'tenGames', target: 10, reward: 10 },
  { id: 'hundredGames', target: 100, reward: 50 },
  { id: 'thousandGames', target: 1000, reward: 200 },

  { id: 'firstWin', target: 1, reward: 5 },
  { id: 'tenWins', target: 10, reward: 15 },
  { id: 'hundredWins', target: 100, reward: 75 },

  { id: 'winStreak3', target: 3, reward: 15 },
  { id: 'winStreak5', target: 5, reward: 30 },
  { id: 'winStreak10', target: 10, reward: 100 },

  { id: 'flawless', target: 1, reward: 25 },

  { id: 'allTrumps', target: 1, reward: 25 },

  { id: 'loginStreak7', target: 7, reward: 20 },
  { id: 'loginStreak30', target: 30, reward: 100 },

  { id: 'allGames', target: 4, reward: 50 },
  { id: 'firstFriend', target: 1, reward: 10 }
] as const;

export const achievementIdSchema = z.enum([
  'firstGame',
  'tenGames',
  'hundredGames',
  'thousandGames',
  'firstWin',
  'tenWins',
  'hundredWins',
  'winStreak3',
  'winStreak5',
  'winStreak10',
  'flawless',
  'allTrumps',
  'loginStreak7',
  'loginStreak30',
  'allGames',
  'firstFriend'
]);

export type AchievementId = z.infer<typeof achievementIdSchema>;

export type Achievement = (typeof ACHIEVEMENTS)[number];

export const getAchievement = (id: AchievementId): Achievement | undefined =>
  ACHIEVEMENTS.find((entry) => entry.id === id);

export const achievementStateSchema = z.object({
  id: achievementIdSchema,
  progress: z.number().int().nonnegative(),
  target: z.number().int().positive(),
  reward: z.number().int().nonnegative(),
  unlockedAt: z.number().int().nullable(),
  claimedAt: z.number().int().nullable()
});

export type AchievementState = z.infer<typeof achievementStateSchema>;
