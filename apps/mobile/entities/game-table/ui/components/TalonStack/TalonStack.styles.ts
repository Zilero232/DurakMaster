import { StyleSheet } from 'react-native';

import { borderWidth, cardSize, colors, fontFamily, fontSize, radii, spacing } from '@/ui-kit';

export const TALON_SCALE = 0.72;

export const talonCard = {
  width: cardSize.width * TALON_SCALE,
  height: cardSize.height * TALON_SCALE
};

const TRUMP_REVEAL = talonCard.width * 0.62;

const TRUMP_TOP = (talonCard.height - talonCard.width) / 2;

const BADGE_SIZE = 26;

export const styles = StyleSheet.create({
  root: {
    flexShrink: 0,
    alignItems: 'center',
    gap: spacing[2]
  },

  stack: {
    width: talonCard.width + TRUMP_REVEAL,
    height: talonCard.height
  },

  trumpCard: {
    position: 'absolute',
    zIndex: 0,
    top: TRUMP_TOP,
    left: talonCard.width - (talonCard.height - TRUMP_REVEAL)
  },

  back: {
    position: 'absolute',
    zIndex: 1,
    top: 0,
    left: 0
  },

  count: {
    position: 'absolute',
    zIndex: 2,
    bottom: -spacing[2],
    left: -spacing[1],
    overflow: 'hidden',
    minWidth: BADGE_SIZE,
    height: BADGE_SIZE,
    paddingHorizontal: spacing[1],
    borderWidth: borderWidth.hairline,
    borderColor: colors.glassBorder,
    borderRadius: radii.pill,
    fontSize: fontSize.sm,
    fontFamily: fontFamily.displayBold,
    lineHeight: BADGE_SIZE,
    color: colors.onFelt,
    textAlign: 'center',
    backgroundColor: colors.backgroundDeep
  }
});
