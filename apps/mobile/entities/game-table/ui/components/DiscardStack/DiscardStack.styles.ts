import { StyleSheet } from 'react-native';

import { borderWidth, cardSize, colors, fontFamily, fontSize, radii, spacing } from '@/ui-kit';

export const DISCARD_SCALE = 0.62;

export const discardCard = {
  width: cardSize.width * DISCARD_SCALE,
  height: cardSize.height * DISCARD_SCALE
};

export const CARD_OFFSET = 3;

export const VISIBLE_CARDS = 4;

export const styles = StyleSheet.create({
  root: {
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    width: discardCard.width + CARD_OFFSET * VISIBLE_CARDS,
    height: discardCard.height
  },

  card: {
    position: 'absolute',
    borderWidth: borderWidth.hairline,
    borderColor: colors.glassBorder,
    borderRadius: radii.card,
    backgroundColor: colors.feltEdge
  },

  count: {
    position: 'absolute',
    right: -spacing[1],
    bottom: -spacing[1],
    minWidth: 22,
    paddingHorizontal: spacing[1],
    borderRadius: radii.pill,
    fontSize: fontSize.xs,
    fontFamily: fontFamily.sansBold,
    lineHeight: 22,
    color: colors.onFelt,
    textAlign: 'center',
    backgroundColor: colors.backgroundDeep
  }
});
