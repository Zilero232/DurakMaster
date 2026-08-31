import { StyleSheet } from 'react-native';

import {
  bubbleTailSize,
  colors,
  fontFamily,
  fontSize,
  lineHeight,
  radii,
  shadows,
  spacing
} from '@/ui-kit';

const BUBBLE_MAX_WIDTH = 140;

const BELOW_CLEARANCE = spacing[1];

const WALLET_CHIP_ROW = lineHeight.tight(fontSize.sm) + spacing[1] * 2;

const ABOVE_CLEARANCE = WALLET_CHIP_ROW + spacing[2];

export const styles = StyleSheet.create({
  emoji: {
    pointerEvents: 'none',
    position: 'absolute',
    inset: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },

  bubble: {
    pointerEvents: 'none',
    position: 'absolute',
    alignSelf: 'center',
    zIndex: 5,

    maxWidth: BUBBLE_MAX_WIDTH,
    paddingVertical: spacing[1],
    paddingHorizontal: spacing[3],
    borderRadius: radii.md,
    backgroundColor: colors.surface1,
    ...shadows.cardRaised
  },

  above: {
    bottom: '100%',
    marginBottom: ABOVE_CLEARANCE
  },

  tail: {
    position: 'absolute',
    alignSelf: 'center',
    width: 0,
    height: 0,
    borderLeftWidth: bubbleTailSize,
    borderRightWidth: bubbleTailSize,
    borderLeftColor: colors.transparent,
    borderRightColor: colors.transparent
  },

  tailAbove: {
    top: '100%',
    borderTopWidth: bubbleTailSize,
    borderTopColor: colors.surface1
  },

  tailBelow: {
    bottom: '100%',
    borderBottomWidth: bubbleTailSize,
    borderBottomColor: colors.surface1
  },

  below: {
    top: '100%',
    marginTop: BELOW_CLEARANCE
  },

  bubbleText: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.sansSemi,
    color: colors.foreground,
    textAlign: 'center'
  }
});
