import type { SeatMetrics } from '../../hooks';
import type { SeatContextValue } from './seat-context.types';

const EMPTY_SEAT_METRICS: SeatMetrics = {
  avatar: 0,
  ring: 0,
  hat: 0,
  back: 0,
  label: 0,
  minWidth: 0,
  maxWidth: 0
};

export const EMPTY_SEAT_CONTEXT: SeatContextValue = {
  metrics: EMPTY_SEAT_METRICS,
  arcLift: 0,

  name: '',
  avatarUrl: null,
  handCount: 0,
  backWidth: 0,

  isEmpty: true,
  isActive: false,
  isReady: false,
  isLoser: false,
  isAttacker: false,
  isDefender: false,
  isOut: false,
  isDisconnected: false,

  turnDeadline: null,
  turnSeconds: 0
};
