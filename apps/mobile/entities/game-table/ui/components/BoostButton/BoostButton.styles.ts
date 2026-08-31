import { StyleSheet } from 'react-native';

import { borderWidth, colors, fontFamily, fontSize, radii, shadows, spacing } from '@/ui-kit';

const SIZE = 36;

export const BOOST_SIZE = SIZE;

export const styles = StyleSheet.create({
  root: {
    alignItems: 'center'
  },

  button: {
    alignItems: 'center',
    gap: 2
  },

  icon: {
    alignItems: 'center',
    justifyContent: 'center',
    width: SIZE,
    height: SIZE,
    borderWidth: borderWidth.hairline,
    borderColor: colors.glassBorder,
    borderRadius: radii.md,
    backgroundColor: colors.glassStrong,
    ...shadows.tile
  },

  disabled: {
    opacity: 0.4
  },

  price: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2
  },

  priceValue: {
    fontSize: fontSize.xs,
    fontFamily: fontFamily.sansBold,
    color: colors.gold
  },

  hint: {
    position: 'absolute',
    bottom: SIZE + spacing[5],
    zIndex: 20,
    gap: 2,
    width: 190,
    padding: spacing[3],
    borderWidth: borderWidth.hairline,
    borderColor: colors.border,
    borderRadius: radii.md,
    backgroundColor: colors.surfaceOverlay,
    ...shadows.panel
  },

  hintTitle: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.sansBold,
    color: colors.foreground
  },

  hintText: {
    fontSize: fontSize.xs,
    fontFamily: fontFamily.sans,
    lineHeight: 16,
    color: colors.mutedForeground
  }
});
