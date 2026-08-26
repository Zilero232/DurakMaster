import { StyleSheet } from 'react-native';

import { cardSize, colors, fontFamily, fontSize, radii, shadows, spacing } from '@/ui-kit';

export const TALON_SCALE = 0.72;

export const talonCard = {
  width: cardSize.width * TALON_SCALE,
  height: cardSize.height * TALON_SCALE
};

const TRUMP_TOP = (talonCard.height - talonCard.width) / 2;
const TRUMP_LEFT = talonCard.height * 0.34;

export const styles = StyleSheet.create({
  root: {
    flexShrink: 0,
    alignItems: 'center',
    gap: spacing[2]
  },

  stack: {
    width: talonCard.width * 1.75,
    height: talonCard.height
  },

  trumpCard: {
    position: 'absolute',
    zIndex: 0,
    top: TRUMP_TOP,
    left: TRUMP_LEFT
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
    right: talonCard.width * 0.5 - 15,
    bottom: -8,
    overflow: 'hidden',
    minWidth: 30,
    height: 30,
    borderRadius: radii.pill,
    fontSize: fontSize.md,
    fontWeight: '700',
    fontFamily: fontFamily.displayBold,
    lineHeight: 30,
    color: colors.onFelt,
    textAlign: 'center',
    backgroundColor: colors.feltEdge
  },

  trumpBadge: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 30,
    height: 30,
    borderRadius: radii.pill,
    backgroundColor: colors.surface1,
    ...shadows.card
  },

  trumpSymbol: {
    fontSize: fontSize.lg,
    color: colors.foreground
  },

  trumpSymbolRed: {
    color: colors.accent
  }
});
