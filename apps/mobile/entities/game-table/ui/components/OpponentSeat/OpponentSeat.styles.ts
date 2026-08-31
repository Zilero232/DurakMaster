import { StyleSheet } from 'react-native';

import { borderWidth, cardSize, colors, fontSize, glow, radii, shadows, spacing } from '@/ui-kit';

export const BACK_SCALE = 0.42;

export const backSize = {
  width: cardSize.width * BACK_SCALE,
  height: cardSize.height * BACK_SCALE
};

export const AVATAR_SIZE = 38;

export const HAT_SIZE = 26;
export const RING_PADDING = 2;
export const RING_SIZE = AVATAR_SIZE + (RING_PADDING + borderWidth.regular) * 2;

export const BACK_STEP_X = 6;

export const EMPTY_SEAT_WIDTH = 64;
export const BACK_STEP_ANGLE = 3;

export const styles = StyleSheet.create({
  pressed: {
    backgroundColor: colors.glassStrong
  },

  root: {
    alignItems: 'center',
    gap: 0,
    flexShrink: 1,
    minWidth: 0,
    paddingVertical: spacing[1],
    paddingHorizontal: spacing[2],
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    backgroundColor: colors.glass
  },

  active: {
    borderColor: colors.borderAccent,
    backgroundColor: colors.glassStrong,
    ...glow.accent
  },

  out: {
    borderColor: colors.border
  },

  empty: {
    justifyContent: 'center',
    minWidth: EMPTY_SEAT_WIDTH,
    paddingVertical: spacing[2],
    borderStyle: 'dashed',
    borderColor: colors.borderStrong
  },

  phrase: {
    position: 'absolute',
    zIndex: 5,
    top: -14,
    right: -4,
    maxWidth: 180,
    paddingVertical: spacing[1],
    paddingHorizontal: spacing[3],
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.glassBorder,
    borderRadius: radii.pill,
    fontSize: fontSize.sm,
    color: colors.foreground,
    backgroundColor: colors.surfaceOverlay,
    overflow: 'hidden',
    ...shadows.card
  }
});
