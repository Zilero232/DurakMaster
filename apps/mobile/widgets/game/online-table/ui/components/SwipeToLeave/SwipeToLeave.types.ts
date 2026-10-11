import type { ReactNode } from 'react';

export type SwipeToLeaveProps = {
  children: ReactNode;

  /** Off during a deal: leaving then is a surrender, which only the confirm dialog may do. */
  isEnabled: boolean;
  onLeave: () => void;
};
