import { StyleSheet } from 'react-native';

import { borderWidth, colors, fontFamily, fontSize, radii, spacing } from '@/ui-kit';

const SIZE = 44;

export const BOOST_SIZE = SIZE;

export const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    justifyContent: 'center',
    width: SIZE,
    height: SIZE,
    borderWidth: borderWidth.hairline,
    borderColor: colors.glassBorder,
    borderRadius: radii.md,
    backgroundColor: colors.glassStrong
  },

  disabled: {
    opacity: 0.4
  },

  price: {
    position: 'absolute',
    top: -spacing[1],
    right: -spacing[1],
    minWidth: 18,
    paddingHorizontal: spacing[1],
    borderRadius: radii.pill,
    fontSize: fontSize.xs,
    fontFamily: fontFamily.sansBold,
    lineHeight: 18,
    color: colors.goldDeep,
    textAlign: 'center',
    backgroundColor: colors.gold
  }
});
