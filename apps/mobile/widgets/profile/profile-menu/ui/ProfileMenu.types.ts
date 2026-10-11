import type { LucideIcon } from 'lucide-react-native';

import type { CountBadgeTone } from '@/ui-kit';

export type ProfileMenuPanel = 'achievements' | 'friends' | 'leaderboard' | 'rules' | 'settings';

export type ProfileMenuKey = 'share' | ProfileMenuPanel;

export type ProfileMenuEntry = {
  id: ProfileMenuKey;
  icon: LucideIcon;
  tint: string;
  badgeTone?: CountBadgeTone;
};

export type ProfileMenuProps = {
  onOpenPanel: (panel: ProfileMenuPanel) => void;
};
