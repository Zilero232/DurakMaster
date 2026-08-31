import { useWindowDimensions } from 'react-native';

import { breakpoint } from '@/shared/model/layout';

export type SeatMetrics = {
  avatar: number;
  ring: number;
  hat: number;
  minWidth: number;
  maxWidth: number;
};

const COMPACT: SeatMetrics = { avatar: 34, ring: 42, hat: 24, minWidth: 76, maxWidth: 108 };

const WIDE: SeatMetrics = { avatar: 38, ring: 46, hat: 26, minWidth: 104, maxWidth: 140 };

const DESKTOP: SeatMetrics = { avatar: 42, ring: 50, hat: 28, minWidth: 120, maxWidth: 160 };

const ROW_PADDING = 16;

const SEAT_GAP = 8;

const MIN_SEAT_WIDTH = 46;

const MIN_SEAT_SCALE = 0.6;

const fitToRow = (metrics: SeatMetrics, width: number, seats: number): SeatMetrics => {
  if (seats <= 0) {
    return metrics;
  }

  const perSeat = (width - ROW_PADDING) / seats - SEAT_GAP;

  if (perSeat >= metrics.minWidth) {
    return metrics;
  }

  const scale = Math.max(MIN_SEAT_SCALE, perSeat / metrics.minWidth);

  return {
    avatar: Math.round(metrics.avatar * scale),
    ring: Math.round(metrics.ring * scale),
    hat: Math.round(metrics.hat * scale),
    minWidth: Math.max(MIN_SEAT_WIDTH, Math.floor(perSeat)),
    maxWidth: Math.max(MIN_SEAT_WIDTH, Math.floor(perSeat))
  };
};

export const useSeatSize = (seats = 0): SeatMetrics => {
  const { width } = useWindowDimensions();

  if (width >= breakpoint.desktop) {
    return fitToRow(DESKTOP, width, seats);
  }

  return fitToRow(width >= breakpoint.medium ? WIDE : COMPACT, width, seats);
};
