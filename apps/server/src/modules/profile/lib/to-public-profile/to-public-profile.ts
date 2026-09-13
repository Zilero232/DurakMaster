import type { PublicProfile } from '@durak-master/schemas';

export type ProfileStats = {
  rating: number;
  gamesPlayed: number;
  gamesWon: number;
  gamesLost: number;
  premiumUntil: Date | null;
};

export type ProfileOwner = {
  userId: string;
  name: string;
  image: string | null;
};

export const toPublicProfile = (
  owner: ProfileOwner,
  stats: ProfileStats,
  isOnline: boolean
): PublicProfile => ({
  userId: owner.userId,
  name: owner.name,
  avatarUrl: owner.image,
  rating: stats.rating,
  seasonRating: stats.rating,
  gamesPlayed: stats.gamesPlayed,
  gamesWon: stats.gamesWon,
  gamesLost: stats.gamesLost,
  isPremium: (stats.premiumUntil?.getTime() ?? 0) > Date.now(),
  isOnline
});
