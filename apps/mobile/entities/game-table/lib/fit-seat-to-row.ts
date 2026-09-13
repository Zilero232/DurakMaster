import { clamp } from 'remeda';

import type { FitSeatToRowInput, SeatMetrics } from './fit-seat-to-row.types';

import {
  BACK_RATIO,
  MIN_SEAT_WIDTH,
  ROW_PADDING,
  SEAT_GAP,
  SEAT_SCALE
} from './fit-seat-to-row.config';

export const fitSeatToRow = ({ base, label, width, seats }: FitSeatToRowInput): SeatMetrics => {
  const perSeat = seats > 0 ? (width - ROW_PADDING) / seats - SEAT_GAP : base.minWidth;

  const scale = clamp(perSeat / base.minWidth, SEAT_SCALE);

  const avatar = Math.round(base.avatar * scale);

  return {
    avatar,
    ring: Math.round(base.ring * scale),
    hat: Math.round(base.hat * scale),
    back: Math.round(avatar * BACK_RATIO),
    label: Math.round(clamp(base.label * scale, label)),
    minWidth: Math.max(MIN_SEAT_WIDTH, Math.round(base.minWidth * scale)),
    maxWidth: Math.max(MIN_SEAT_WIDTH, Math.round(base.maxWidth * scale))
  };
};
