import type { LucideIcon } from 'lucide-react-native';

export type ProfileMenuKey =
  'achievements' | 'friends' | 'items' | 'leaderboard' | 'news' | 'rules' | 'settings' | 'share';

export type ProfileMenuItem = {
  id: ProfileMenuKey;
  icon: LucideIcon;
  badge?: string;
  isLocked?: boolean;
  onPress?: () => void;
};

export type ProfileMenuProps = {
  onQuickGame: () => void;
  onOpenSettings: () => void;
  onOpenRules: () => void;
};
