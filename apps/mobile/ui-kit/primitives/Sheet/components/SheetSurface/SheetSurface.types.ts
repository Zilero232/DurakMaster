import type { ReactNode } from 'react';

export type SheetSurfaceProps = {
  /** Wide screens get a centred dialog; phones get a drawer that drags down to close. */
  isDialog: boolean;
  isOpen: boolean;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  maxWidth?: number;
  maxHeight: number;
  onClose: () => void;
};
