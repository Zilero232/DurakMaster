import type { MyProfile } from '@durak-master/schemas';
import type { ReactNode } from 'react';

import type { Chatter } from '../SeatChatter';

export type TableBarProps = {
  profile: MyProfile | null;
  chatter?: Chatter;

  isWaiting: boolean;
  isReady: boolean;
  isMyTurn: boolean;
  isLoser?: boolean;
  hasFreeSeat: boolean;

  turnDeadline: number | null;
  turnSeconds: number;

  actions?: ReactNode;
  extras?: ReactNode;

  onReady: (isReady: boolean) => void;
  onAddBot: () => void;
  onOpenEmojis: () => void;
};
