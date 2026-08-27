import { useWindowDimensions } from 'react-native';

import type { CardScaleName } from '@/ui-kit';

import { CARD_SCALE, getCardSize } from '@/ui-kit';

export type CardMetrics = {
  width: number;
  height: number;

  available: number;
};

export const useCardSize = (scale: CardScaleName = 'normal', edgePadding = 0): CardMetrics => {
  const { width: windowWidth } = useWindowDimensions();

  const { width, height } = getCardSize(windowWidth, CARD_SCALE[scale]);

  return {
    width,
    height,
    available: Math.max(0, windowWidth - edgePadding * 2)
  };
};
