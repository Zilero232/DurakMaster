import { clamp } from 'remeda';

import type { FitSeatToRowInput, SeatMetrics } from './fit-seat-to-row.types';

import {
  BACK_RATIO,
  MIN_AVATAR,
  MIN_SEAT_WIDTH,
  SEAT_GAP,
  SEAT_SCALE
} from './fit-seat-to-row.config';

export const fitSeatToRow = ({ base, label, width, seats }: FitSeatToRowInput): SeatMetrics => {
  const room = width - SEAT_GAP * Math.max(0, seats - 1);

  const perSeat = seats > 0 ? room / seats : base.width;

  const scale = clamp(perSeat / base.width, SEAT_SCALE);

  const avatar = Math.max(MIN_AVATAR, Math.round(base.avatar * scale));

  return {
    avatar,
    ring: avatar + base.ring - base.avatar,
    back: Math.round(avatar * BACK_RATIO),
    label: Math.round(clamp(base.label * scale, label)),
    width: Math.min(Math.max(MIN_SEAT_WIDTH, Math.round(base.width * scale)), Math.floor(perSeat))
  };
};
