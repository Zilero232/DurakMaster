import type { LucideIcon } from 'lucide-react-native';

export type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  hint?: string;
  action?: {
    label: string;
    onPress: () => void;
  };
};
