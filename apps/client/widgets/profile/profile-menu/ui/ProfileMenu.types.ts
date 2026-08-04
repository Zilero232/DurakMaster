import type { LucideIcon } from 'lucide-react';

/** Ключи разделов меню — совпадают с ветвью `menu.*` в переводах. */
export type ProfileMenuKey =
  | 'news'
  | 'friends'
  | 'items'
  | 'leaderboard'
  | 'achievements'
  | 'settings'
  | 'share'
  | 'rules';

export type ProfileMenuItem = {
  id: string;
  icon: LucideIcon;
  labelKey: ProfileMenuKey;
  /** Счётчик или таймер справа от иконки — «0/46», «3», «1 д. 01 ч.». */
  badge?: string;
  /** Пункт видно, но он ещё не открыт. */
  isLocked?: boolean;
  onClick?: () => void;
};

export type ProfileMenuProps = {
  onQuickGame: () => void;
  onOpenSettings: () => void;
  onOpenRules: () => void;
};
