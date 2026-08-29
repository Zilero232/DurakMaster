import { z } from 'zod';

import { MAX_NAME_LENGTH } from '../auth/credentials';

export const LEAGUES = [
  { id: 'silver', color: '#b8bcc4' },
  { id: 'gold', color: '#e0b64a' },
  { id: 'ruby', color: '#d3564f' },
  { id: 'emerald', color: '#4caf7d' },
  { id: 'sapphire', color: '#4a80d3' },
  { id: 'supreme', color: '#a06ad4' }
] as const;

export const leagueIdSchema = z.enum(['silver', 'gold', 'ruby', 'emerald', 'sapphire', 'supreme']);

export type LeagueId = z.infer<typeof leagueIdSchema>;

export const AVATAR_SEED_PREFIX = 'dicebear:';

export const AVATAR_SEEDS = [
  'ace',
  'trump',
  'joker',
  'queen',
  'king',
  'jack',
  'spade',
  'heart',
  'club',
  'diamond',
  'bluff',
  'fortune'
] as const;

export type AvatarSeed = (typeof AVATAR_SEEDS)[number];

export const avatarSeedSchema = z.enum(AVATAR_SEEDS);

export const toAvatarUrl = (seed: AvatarSeed): string => `${AVATAR_SEED_PREFIX}${seed}`;

export const parseAvatarSeed = (value: string | null): string | null =>
  value?.startsWith(AVATAR_SEED_PREFIX) ? value.slice(AVATAR_SEED_PREFIX.length) : null;

export const LEVELS_PER_LEAGUE = 16;
export const RATING_PER_LEVEL = 100;

export const publicProfileSchema = z.object({
  userId: z.string(),
  name: z.string(),
  avatarUrl: z.string().nullable(),

  rating: z.number().int(),
  seasonRating: z.number().int(),

  gamesPlayed: z.number().int().nonnegative(),
  gamesWon: z.number().int().nonnegative(),
  gamesLost: z.number().int().nonnegative(),

  isPremium: z.boolean(),
  isOnline: z.boolean()
});

export type PublicProfile = z.infer<typeof publicProfileSchema>;

export const myProfileSchema = publicProfileSchema.extend({
  credits: z.number().int().nonnegative(),
  coins: z.number().int().nonnegative(),

  premiumUntil: z.number().int().nullable(),
  loginStreak: z.number().int().nonnegative(),
  nextFreeCreditsAt: z.number().int().nullable()
});

export type MyProfile = z.infer<typeof myProfileSchema>;

export type RankInfo = {
  league: (typeof LEAGUES)[number];
  leagueIndex: number;
  level: number;
  progress: number;
};

export function getRankInfo(rating: number): RankInfo {
  const totalLevels = Math.floor(Math.max(0, rating) / RATING_PER_LEVEL);
  const leagueIndex = Math.min(Math.floor(totalLevels / LEVELS_PER_LEAGUE), LEAGUES.length - 1);
  const level = Math.min(totalLevels % LEVELS_PER_LEAGUE, LEVELS_PER_LEAGUE - 1) + 1;
  const progress = (Math.max(0, rating) % RATING_PER_LEVEL) / RATING_PER_LEVEL;

  return {
    league: LEAGUES[leagueIndex] ?? LEAGUES[0],
    leagueIndex,
    level,
    progress
  };
}

export function computeRatingGain(winnings: number, currentRating: number): number {
  if (winnings <= 0) {
    return 0;
  }

  const base = Math.log2(winnings + 1) * 4;
  const damping = 1 / (1 + currentRating / 5000);

  return Math.max(1, Math.round(base * damping));
}

export const setNameInputSchema = z.object({
  name: z.string().trim().min(2).max(MAX_NAME_LENGTH)
});

export const setAvatarInputSchema = z.object({ seed: avatarSeedSchema });

export type SetNameInput = z.infer<typeof setNameInputSchema>;
export type SetAvatarInput = z.infer<typeof setAvatarInputSchema>;
