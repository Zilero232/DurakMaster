import { StyleSheet } from 'react-native';

import {
  borderWidth,
  colors,
  fontFamily,
  fontSize,
  opacity,
  radii,
  seatRowGap,
  shadows,
  TAP_TARGET
} from '@/ui-kit';

export const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    gap: seatRowGap
  },

  pressed: {
    opacity: opacity.muted,
    transform: [{ scale: 0.95 }]
  },

  dimmed: {
    opacity: opacity.disabled
  },

  icon: {
    alignItems: 'center',
    justifyContent: 'center',
    width: TAP_TARGET,
    height: TAP_TARGET,
    borderWidth: borderWidth.hairline,
    borderColor: colors.glassBorder,
    borderRadius: radii.md,
    backgroundColor: colors.glassStrong,
    ...shadows.tile
  },

  price: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: seatRowGap
  },

  priceValue: {
    fontSize: fontSize.xs,
    fontFamily: fontFamily.sansBold,
    color: colors.gold
  }
});
