import { useWindowDimensions } from 'react-native';

import type { CardScaleName } from '@/ui-kit';

import { CARD_SCALE, getCardSize, TABLE_MAX_WIDTH } from '@/ui-kit';

import type { CardMetrics } from './use-card-size.types';

export const useCardSize = (scale: CardScaleName = 'normal', edgePadding = 0): CardMetrics => {
  const { width: windowWidth } = useWindowDimensions();

  const tableWidth = Math.min(windowWidth, TABLE_MAX_WIDTH);

  const { width, height } = getCardSize(tableWidth, CARD_SCALE[scale]);

  return {
    width,
    height,
    available: Math.max(0, tableWidth - edgePadding * 2)
  };
};
