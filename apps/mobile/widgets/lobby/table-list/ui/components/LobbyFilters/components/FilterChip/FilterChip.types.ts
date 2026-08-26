import type { LucideIcon } from 'lucide-react-native';

export type FilterChipProps = {
  label: string;
  isActive: boolean;
  icon?: LucideIcon;
  accessibilityRole?: 'checkbox' | 'radio';
  onPress: () => void;
};
