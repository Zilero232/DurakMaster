import { PixelRatio } from 'react-native';
import { clamp } from 'remeda';

import { card, spacing } from './tokens';

const MIN_CARD_WIDTH = 56;
const MAX_CARD_WIDTH = 124;

const CARD_WIDTH_RATIO = 0.175;

export const getCardSize = (screenWidth: number) => {
  const width = PixelRatio.roundToNearestPixel(
    clamp(screenWidth * CARD_WIDTH_RATIO, { min: MIN_CARD_WIDTH, max: MAX_CARD_WIDTH })
  );

  return {
    width,
    height: PixelRatio.roundToNearestPixel(width / card.ratio)
  };
};

export const MAX_FAN_ANGLE = 18;

export const ICON_BUTTON_SIZE = 36;

export const CORNER_BUTTON_SIZE = 40;

export const CORNER_BUTTON_CLEARANCE = CORNER_BUTTON_SIZE + spacing[3] * 2;

export const HINT_MAX_WIDTH = 190;
