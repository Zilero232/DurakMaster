import { StyleSheet } from 'react-native';

import { borderWidth, cardSize, colors, fontSize, radii, shadows, spacing } from '@/ui-kit';

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
export const BACK_STEP_ANGLE = 3;

export const styles = StyleSheet.create({
  pressed: {
    backgroundColor: colors.glassStrong
  },

  root: {
    alignItems: 'center',
    gap: 0,
    flexShrink: 1,
    paddingVertical: spacing[1],
    paddingHorizontal: spacing[1],
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    backgroundColor: colors.glass
  },

  active: {
    borderColor: colors.glassBorder,
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    boxShadow: '0px 0px 10px rgba(225, 175, 59, 0.8)',
    elevation: 8
  },

  out: {
    borderColor: colors.border
  },

  empty: {
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
