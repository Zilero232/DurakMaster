import type { RankInfo } from '@durak-master/schemas';

export type PlayerIdentityProps = {
  name: string;
  avatarUrl: string | null;
  rank: RankInfo;
  isPremium: boolean;
};
