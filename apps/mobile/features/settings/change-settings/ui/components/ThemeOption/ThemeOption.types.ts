import type { CardTheme } from '@/ui-kit';

export type ThemeOptionProps = {
  theme: CardTheme;
  label: string;
  isActive: boolean;
  onPress: () => void;
};
