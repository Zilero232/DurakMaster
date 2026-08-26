import type { MyProfile } from '@durak-master/schemas';

export type ProfileTabProps = {
  profile: MyProfile;
  onClaimBonus: () => void;
  onOpenRules: () => void;
  onOpenStats: () => void;
  onOpenFriends: () => void;
  onOpenProfileEditor: () => void;
  onOpenAchievements: () => void;
  onOpenLeaderboard: () => void;
};
