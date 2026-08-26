import type { LucideIcon } from 'lucide-react-native';

export type MenuTileProps = {
  icon: LucideIcon;
  label: string;

  tint: string;
  badge?: string;
  isLocked?: boolean;
  onPress?: () => void;
};
