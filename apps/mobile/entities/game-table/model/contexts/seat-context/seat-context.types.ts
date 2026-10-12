import type { SeatMetrics } from '../../../lib';
import type { Chatter } from '../../chatter';

export type SeatContextValue = {
  metrics: SeatMetrics;

  name: string;
  avatarUrl: string | null;
  handCount: number;
  backWidth: number;

  isEmpty: boolean;
  isInvitable: boolean;
  isActive: boolean;
  isReady: boolean;
  isAttacker: boolean;
  isDefender: boolean;
  isOut: boolean;
  isDisconnected: boolean;

  phrase?: Chatter;
  turnDeadline: number | null;
  turnSeconds: number;
};
