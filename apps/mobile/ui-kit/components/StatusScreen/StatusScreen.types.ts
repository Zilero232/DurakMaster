import type { ReactNode } from 'react';

export type StatusScreenTone = 'gain' | 'loss' | 'neutral';

export type StatusScreenProps = {
  icon?: ReactNode;
  title: string;
  description?: string;

  /** The figure the screen is about — a reward, a score. Reads large, not as a code. */
  highlight?: string;
  highlightTone?: StatusScreenTone;

  /** Technical text such as an error code; rendered small and monospaced. */
  details?: string;
  actions?: ReactNode;
};
