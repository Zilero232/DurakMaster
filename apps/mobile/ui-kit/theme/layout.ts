import { Dimensions, PixelRatio } from 'react-native';
import { clamp } from 'remeda';

import { card } from './tokens';

const MIN_CARD_WIDTH = 56;
const MAX_CARD_WIDTH = 124;

const CARD_WIDTH_RATIO = 0.175;

export const CARD_SCALE = {
  small: 0.85,
  normal: 1,
  large: 1.2
} as const;

export type CardScaleName = keyof typeof CARD_SCALE;

export const getCardSize = (screenWidth: number, scale: number = 1) => {
  const width = PixelRatio.roundToNearestPixel(
    clamp(screenWidth * CARD_WIDTH_RATIO * scale, { min: MIN_CARD_WIDTH, max: MAX_CARD_WIDTH })
  );

  return {
    width,
    height: PixelRatio.roundToNearestPixel(width / card.ratio)
  };
};

export const screen = Dimensions.get('window');
export const cardSize = getCardSize(screen.width);

export const MAX_FAN_ANGLE = 18;

export const CONTENT_MAX_WIDTH = 720;

export const DESKTOP_MAX_WIDTH = 1440;

export const TABLE_MAX_WIDTH = 900;
