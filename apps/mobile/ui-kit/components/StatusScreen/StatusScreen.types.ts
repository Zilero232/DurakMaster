import type { ReactNode } from 'react';

export type StatusScreenProps = {
  icon?: ReactNode;
  title: string;
  description?: string;
  details?: string;
  actions?: ReactNode;
};
