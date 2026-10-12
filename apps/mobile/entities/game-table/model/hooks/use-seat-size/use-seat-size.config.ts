import { fontSize, spacing } from '@/ui-kit';

import type { SeatBase } from '../../../lib';

export const SEAT_BASE: SeatBase = {
  avatar: 38,
  ring: 46,
  label: fontSize.sm,
  width: 92
};

export const LABEL_RANGE = { min: fontSize.sm, max: fontSize.md };

export const FALLBACK_ROW_INSETS = spacing[2] * 2;
