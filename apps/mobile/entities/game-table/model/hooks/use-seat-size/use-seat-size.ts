import { useWindowDimensions } from 'react-native';

import type { SeatMetrics } from '../../../lib';
import type { UseSeatSizeInput } from './use-seat-size.types';

import { fitSeatToRow } from '../../../lib';
import { FALLBACK_ROW_INSETS, LABEL_RANGE, SEAT_BASE } from './use-seat-size.config';

export const useSeatSize = ({ seats, rowWidth }: UseSeatSizeInput): SeatMetrics => {
  const { width: windowWidth } = useWindowDimensions();

  return fitSeatToRow({
    base: SEAT_BASE,
    label: LABEL_RANGE,
    width: rowWidth ?? windowWidth - FALLBACK_ROW_INSETS,
    seats
  });
};
