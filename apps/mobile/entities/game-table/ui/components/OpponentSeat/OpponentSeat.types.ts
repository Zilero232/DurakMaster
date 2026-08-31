import type { PlayerState } from '@durak-master/schemas';

import type { Chatter } from '../SeatChatter';

export type OpponentSeatProps = {
  seatCount: number;
  arcLift?: number;

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

  isLoser?: boolean;
  onPress?: () => void;
};
