import type { ReactNode } from 'react';

export type SheetProps = {
  /** Narrows the desktop dialog — a short confirmation should not span the default width. */
  maxWidth?: number;

  isOpen: boolean;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  onClose: () => void;
};
