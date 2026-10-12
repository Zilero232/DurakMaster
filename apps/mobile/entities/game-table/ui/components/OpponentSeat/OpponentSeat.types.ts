import type { PlayerState } from '@durak-master/schemas';

import type { Chatter } from '../../../model';

export type OpponentSeatProps = {
  seatCount: number;
  rowWidth?: number;

  isEmpty?: boolean;
  isReady?: boolean;
  player: PlayerState;
  name: string;
  avatarUrl?: string | null;

  phrase?: Chatter;

  turnDeadline?: number | null;
  turnSeconds?: number;
  isAttacker: boolean;
  isDefender: boolean;
  isActive: boolean;

  /** Battery saver stops the active-seat pulse. */
  isStatic?: boolean;

  /** Without it the seat is not tappable; an empty seat with it invites a friend. */
  onPress?: () => void;
};
