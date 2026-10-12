import type { LucideIcon } from 'lucide-react-native';

export type MenuToggleProps = {
  icon: LucideIcon;
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
};
