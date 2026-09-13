import type { LucideIcon } from 'lucide-react-native';
import type { ReactNode } from 'react';

export type SettingsSectionProps = {
  title: string;
  children: ReactNode;
  icon?: LucideIcon;
  hint?: string;
  isInRow?: boolean;
  isPlain?: boolean;
};
