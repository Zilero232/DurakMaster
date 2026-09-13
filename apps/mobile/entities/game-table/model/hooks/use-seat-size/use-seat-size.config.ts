import { fontSize } from '@/ui-kit';

import type { SeatBase } from '../../../lib';

export const COMPACT: SeatBase = {
  avatar: 34,
  ring: 42,
  hat: 24,
  label: fontSize.xs,
  minWidth: 76,
  maxWidth: 108
};

export const WIDE: SeatBase = {
  avatar: 38,
  ring: 46,
  hat: 26,
  label: fontSize.xs,
  minWidth: 104,
  maxWidth: 140
};

export const DESKTOP: SeatBase = {
  avatar: 42,
  ring: 50,
  hat: 28,
  label: fontSize.xs,
  minWidth: 120,
  maxWidth: 160
};

export const LABEL_RANGE = { min: fontSize.xs, max: fontSize.md };
