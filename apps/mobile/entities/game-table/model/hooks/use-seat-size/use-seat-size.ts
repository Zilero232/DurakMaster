import { useWindowDimensions } from 'react-native';

import { CORNER_BUTTON_CLEARANCE, spacing } from '@/ui-kit';

import type { SeatMetrics } from '../../../lib';

import { fitSeatToRow } from '../../../lib';
import { LABEL_RANGE, SEAT_BASE } from './use-seat-size.config';

const ROW_INSETS = spacing[2] + CORNER_BUTTON_CLEARANCE;

export const useSeatSize = (seats = 0): SeatMetrics => {
  const { width } = useWindowDimensions();

  return fitSeatToRow({
    base: SEAT_BASE,
    label: LABEL_RANGE,
    width: width - ROW_INSETS,
    seats
  });
};
