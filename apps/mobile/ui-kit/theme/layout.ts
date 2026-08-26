import { Dimensions, PixelRatio } from 'react-native';
import { clamp } from 'remeda';

import { card } from './tokens';

const MIN_CARD_WIDTH = 58;
const MAX_CARD_WIDTH = 104;

const CARD_WIDTH_RATIO = 0.2;

export const getCardSize = (screenWidth: number) => {
  const width = PixelRatio.roundToNearestPixel(
    clamp(screenWidth * CARD_WIDTH_RATIO, { min: MIN_CARD_WIDTH, max: MAX_CARD_WIDTH })
  );

  return {
    width,
    height: PixelRatio.roundToNearestPixel(width / card.ratio)
  };
};

export const screen = Dimensions.get('window');
export const cardSize = getCardSize(screen.width);

export const MAX_FAN_ANGLE = 24;
