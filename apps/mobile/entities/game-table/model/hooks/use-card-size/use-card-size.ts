import { useWindowDimensions } from 'react-native';

import { getCardSize } from '@/ui-kit';

import type { CardMetrics } from './use-card-size.types';

export const useCardSize = (edgePadding = 0): CardMetrics => {
  const { width: tableWidth } = useWindowDimensions();

  const { width, height } = getCardSize(tableWidth);

  return {
    width,
    height,
    available: Math.max(0, tableWidth - edgePadding * 2)
  };
};
