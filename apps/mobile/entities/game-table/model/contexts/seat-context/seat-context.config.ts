import type { SeatMetrics } from '../../../lib';
import type { SeatContextValue } from './seat-context.types';

const EMPTY_SEAT_METRICS: SeatMetrics = {
  avatar: 0,
  ring: 0,
  back: 0,
  label: 0,
  width: 0
};

export const EMPTY_SEAT_CONTEXT: SeatContextValue = {
  metrics: EMPTY_SEAT_METRICS,
  arcLift: 0,

  name: '',
  avatarUrl: null,
  handCount: 0,
  backWidth: 0,

  isEmpty: true,
  isInvitable: false,
  isActive: false,
  isReady: false,
  isAttacker: false,
  isDefender: false,
  isOut: false,
  isDisconnected: false,

  turnDeadline: null,
  turnSeconds: 0
};
