import type { Chatter } from '../../../ui/components/SeatChatter';
import type { SeatMetrics } from '../../hooks';

export type SeatContextValue = {
  metrics: SeatMetrics;
  arcLift: number;

  name: string;
  avatarUrl: string | null;
  handCount: number;
  backWidth: number;

  isEmpty: boolean;
  isActive: boolean;
  isReady: boolean;
  isLoser: boolean;
  isAttacker: boolean;
  isDefender: boolean;
  isOut: boolean;
  isDisconnected: boolean;

  phrase?: Chatter;
  turnDeadline: number | null;
  turnSeconds: number;
};
