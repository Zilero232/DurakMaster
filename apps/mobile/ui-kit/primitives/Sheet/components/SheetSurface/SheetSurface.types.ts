import type { ReactNode } from 'react';

export type SheetSurfaceProps = {
  isOpen: boolean;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  maxHeight: number;
  onClose: () => void;
};
