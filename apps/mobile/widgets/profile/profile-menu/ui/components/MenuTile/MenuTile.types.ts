import type { LucideIcon } from 'lucide-react-native';

import type { CountBadgeTone } from '@/ui-kit';

export type MenuTileProps = {
  icon: LucideIcon;
  label: string;

  tint: string;
  badgeCount?: number;
  badgeTone?: CountBadgeTone;
  isLocked?: boolean;
  onPress?: () => void;
};
