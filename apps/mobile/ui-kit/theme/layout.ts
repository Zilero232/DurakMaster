import { PixelRatio } from 'react-native';
import { clamp } from 'remeda';

import { card } from './tokens';

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

export const TAP_TARGET = 44;

export const PRIMARY_ACTION_HEIGHT = 56;

export const DOT_SIZE = 8;

export const ICON_TILE_SIZE = 64;

export const RESULT_ART_SIZE = 72;

export const BET_COLUMN_MIN_WIDTH = 76;
