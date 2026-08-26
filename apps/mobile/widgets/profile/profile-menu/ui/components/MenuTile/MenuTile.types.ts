import type { LucideIcon } from 'lucide-react-native';

export type MenuTileProps = {
  icon: LucideIcon;
  label: string;
  badge?: string;
  isLocked?: boolean;
  onPress?: () => void;
};
