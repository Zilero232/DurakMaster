import type { LucideIcon } from 'lucide-react-native';

export type ProfileMenuKey =
  'achievements' | 'friends' | 'leaderboard' | 'rules' | 'share' | 'stats';

export type ProfileMenuItem = {
  id: ProfileMenuKey;
  icon: LucideIcon;

  tint: string;
  badge?: string;
  isLocked?: boolean;
  onPress?: () => void;
};

export type ProfileMenuProps = {
  onOpenAchievements: () => void;
  onOpenFriends: () => void;
  onOpenLeaderboard: () => void;
  onOpenRules: () => void;
  onOpenStats: () => void;
};
