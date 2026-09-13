import { useWindowDimensions } from 'react-native';

import { breakpoint } from '@/shared/model/layout';

import type { SeatMetrics } from '../../../lib';

import { fitSeatToRow } from '../../../lib';
import { COMPACT, DESKTOP, LABEL_RANGE, WIDE } from './use-seat-size.config';

export const useSeatSize = (seats = 0): SeatMetrics => {
  const { width } = useWindowDimensions();

  if (width >= breakpoint.desktop) {
    return fitSeatToRow({ base: DESKTOP, label: LABEL_RANGE, width, seats });
  }

  return fitSeatToRow({
    base: width >= breakpoint.medium ? WIDE : COMPACT,
    label: LABEL_RANGE,
    width,
    seats
  });
};
