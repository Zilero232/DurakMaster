import { z } from 'zod';

/**
 * Лиги рейтинга. Шесть лиг по шестнадцать уровней — как в RstGames.
 * Порядок фиксирован: индекс = номер лиги.
 */
export const LEAGUES = [
  { id: 'silver', name: 'Серебряная', color: '#b8bcc4' },
  { id: 'gold', name: 'Золотая', color: '#e0b64a' },
  { id: 'ruby', name: 'Рубиновая', color: '#d3564f' },
  { id: 'emerald', name: 'Изумрудная', color: '#4caf7d' },
  { id: 'sapphire', name: 'Сапфировая', color: '#4a80d3' },
  { id: 'supreme', name: 'Высшая', color: '#a06ad4' },
] as const;

export const leagueIdSchema = z.enum(['silver', 'gold', 'ruby', 'emerald', 'sapphire', 'supreme']);

export type LeagueId = z.infer<typeof leagueIdSchema>;

export const LEVELS_PER_LEAGUE = 16;
/** Сколько рейтинга нужно на один уровень. */
export const RATING_PER_LEVEL = 100;

export const publicProfileSchema = z.object({
  userId: z.string(),
  name: z.string(),
  avatarUrl: z.string().nullable(),

  rating: z.number().int(),
  /** Сезонный рейтинг — обнуляется при смене сезона. */
  seasonRating: z.number().int(),

  gamesPlayed: z.number().int().nonnegative(),
  gamesWon: z.number().int().nonnegative(),
  gamesLost: z.number().int().nonnegative(),

  isPremium: z.boolean(),
  isOnline: z.boolean(),
});

export type PublicProfile = z.infer<typeof publicProfileSchema>;

/** Профиль владельца — с балансами и приватными полями. */
export const myProfileSchema = publicProfileSchema.extend({
  /** Мягкая валюта: ставки за столами. */
  credits: z.number().int().nonnegative(),
  /** Твёрдая валюта: покупается за деньги, между игроками не переводится. */
  coins: z.number().int().nonnegative(),

  premiumUntil: z.number().int().nullable(),
  loginStreak: z.number().int().nonnegative(),
  /** Когда в следующий раз доступен бесплатный бонус кредитов. */
  nextFreeCreditsAt: z.number().int().nullable(),
});

export type MyProfile = z.infer<typeof myProfileSchema>;

/** Вычисленное положение в лигах по рейтингу. */
export type RankInfo = {
  league: (typeof LEAGUES)[number];
  leagueIndex: number;
  /** Уровень внутри лиги, 1..16. */
  level: number;
  /** Прогресс до следующего уровня, 0..1. */
  progress: number;
};

/**
 * Раскладывает рейтинг в лигу и уровень.
 * Рейтинг выше последней лиги остаётся в «Высшей» на 16 уровне.
 */
export function getRankInfo(rating: number): RankInfo {
  const totalLevels = Math.floor(Math.max(0, rating) / RATING_PER_LEVEL);
  const leagueIndex = Math.min(Math.floor(totalLevels / LEVELS_PER_LEAGUE), LEAGUES.length - 1);
  const level = Math.min(totalLevels % LEVELS_PER_LEAGUE, LEVELS_PER_LEAGUE - 1) + 1;
  const progress = (Math.max(0, rating) % RATING_PER_LEVEL) / RATING_PER_LEVEL;

  return {
    league: LEAGUES[leagueIndex] ?? LEAGUES[0],
    leagueIndex,
    level,
    progress,
  };
}

/**
 * Прирост рейтинга за победу.
 *
 * Растёт как ДВОИЧНЫЙ ЛОГАРИФМ выигрыша: победа на 1000 даёт примерно
 * в полтора раза больше, чем на 100. Игроки с высоким рейтингом растут
 * медленнее за тот же выигрыш.
 */
export function computeRatingGain(winnings: number, currentRating: number): number {
  if (winnings <= 0) {
    return 0;
  }

  const base = Math.log2(winnings + 1) * 4;
  // Замедление роста: чем выше рейтинг, тем меньше прибавка.
  const damping = 1 / (1 + currentRating / 5000);

  return Math.max(1, Math.round(base * damping));
}
