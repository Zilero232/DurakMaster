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

export const useSeatSize = (): SeatMetrics => {
  const { width } = useWindowDimensions();

  if (width >= breakpoint.desktop) {
    return DESKTOP;
  }

  return width >= breakpoint.medium ? WIDE : COMPACT;
};
