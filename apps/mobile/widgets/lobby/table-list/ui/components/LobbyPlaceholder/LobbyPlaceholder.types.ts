import type { ReactNode } from 'react';

export type LobbyPlaceholderProps = {
  icon: ReactNode;
  title: string;
  hint: string;

  /** Shown under the hint when the state has something for the player to do. */
  action?: ReactNode;
};
