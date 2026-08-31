import { useWindowDimensions } from 'react-native';
import { clamp } from 'remeda';

import { breakpoint } from '@/shared/model/layout';
import { card, fontSize } from '@/ui-kit';

export type SeatMetrics = {
  avatar: number;
  ring: number;
  hat: number;
  back: number;
  label: number;
  minWidth: number;
  maxWidth: number;
};

type SeatBase = Omit<SeatMetrics, 'back' | 'label'>;

const COMPACT: SeatBase = { avatar: 34, ring: 42, hat: 24, minWidth: 76, maxWidth: 108 };

const WIDE: SeatBase = { avatar: 38, ring: 46, hat: 26, minWidth: 104, maxWidth: 140 };

const DESKTOP: SeatBase = { avatar: 42, ring: 50, hat: 28, minWidth: 120, maxWidth: 160 };

const ROW_PADDING = 16;

const SEAT_GAP = 8;

const MIN_SEAT_WIDTH = 46;

const SEAT_SCALE = { min: 0.6, max: 1.6 };

const BACK_RATIO = 0.62;

const fitToRow = (base: SeatBase, width: number, seats: number): SeatMetrics => {
  const perSeat = seats > 0 ? (width - ROW_PADDING) / seats - SEAT_GAP : base.minWidth;

  const scale = clamp(perSeat / base.minWidth, SEAT_SCALE);

  const avatar = Math.round(base.avatar * scale);

  return {
    avatar,
    ring: Math.round(base.ring * scale),
    hat: Math.round(base.hat * scale),
    back: Math.round(avatar * BACK_RATIO),
    label: Math.round(clamp(fontSize.xs * scale, { min: fontSize.xs, max: fontSize.md })),
    minWidth: Math.max(MIN_SEAT_WIDTH, Math.round(base.minWidth * scale)),
    maxWidth: Math.max(MIN_SEAT_WIDTH, Math.round(base.maxWidth * scale))
  };
};

export const useSeatSize = (seats = 0): SeatMetrics => {
  const { width } = useWindowDimensions();

  if (width >= breakpoint.desktop) {
    return fitToRow(DESKTOP, width, seats);
  }

  return fitToRow(width >= breakpoint.medium ? WIDE : COMPACT, width, seats);
};

export const seatBackHeight = (back: number): number => Math.round(back / card.ratio);
