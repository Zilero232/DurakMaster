import type { LucideIcon } from 'lucide-react-native';

export type ModeCardProps = {
  icon: LucideIcon;
  label: string;
  hint?: string;
  isActive: boolean;
  onPress: () => void;
};
