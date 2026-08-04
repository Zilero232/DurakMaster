import type { ReactNode } from 'react';

export type ModalProps = {
  isOpen: boolean;
  title: string;
  children: ReactNode;
  /** Кнопки внизу панели. */
  footer?: ReactNode;
  onClose: () => void;
};
