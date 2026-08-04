import type { LucideIcon } from 'lucide-react';

export type ModeCardProps = {
  icon: LucideIcon;
  label: string;
  /** Короткое пояснение под названием — что режим меняет в правилах. */
  hint?: string;
  isActive: boolean;
  onClick: () => void;
};
