import type { AchievementState } from '@durak-master/schemas';

export type AchievementRowProps = {
  achievement: AchievementState;
  onClaim: (id: AchievementState['id']) => void;
};
