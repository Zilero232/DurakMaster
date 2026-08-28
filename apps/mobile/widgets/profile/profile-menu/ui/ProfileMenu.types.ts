import type { LucideIcon } from 'lucide-react-native';

export type ProfileMenuPanel = 'achievements' | 'friends' | 'leaderboard' | 'rules' | 'settings';

export type ProfileMenuKey = 'share' | ProfileMenuPanel;

export type ProfileMenuEntry = {
  id: ProfileMenuKey;
  icon: LucideIcon;
  tint: string;
  badge?: string;
  isLocked?: boolean;
};

export type ProfileMenuProps = {
  onOpenPanel: (panel: ProfileMenuPanel) => void;
};
