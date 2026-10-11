import { clamp } from 'remeda';

import type { FitSeatToRowInput, SeatMetrics } from './fit-seat-to-row.types';

import { BACK_RATIO, MIN_SEAT_WIDTH, SEAT_GAP, SEAT_SCALE } from './fit-seat-to-row.config';

export const fitSeatToRow = ({ base, label, width, seats }: FitSeatToRowInput): SeatMetrics => {
  const room = width - SEAT_GAP * Math.max(0, seats - 1);

  const perSeat = seats > 0 ? room / seats : base.width;

  const scale = clamp(perSeat / base.width, SEAT_SCALE);

  const avatar = Math.round(base.avatar * scale);

  return {
    avatar,
    ring: Math.round(base.ring * scale),
    back: Math.round(avatar * BACK_RATIO),
    label: Math.round(clamp(base.label * scale, label)),
    width: Math.min(Math.max(MIN_SEAT_WIDTH, Math.round(base.width * scale)), Math.floor(perSeat))
  };
};
