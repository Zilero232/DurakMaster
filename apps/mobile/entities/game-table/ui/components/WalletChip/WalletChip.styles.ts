import { StyleSheet } from 'react-native';

import { borderWidth, colors, fontFamily, fontSize, lineHeight, radii, spacing } from '@/ui-kit';

export const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    paddingVertical: spacing[1],
    paddingHorizontal: spacing[2],
    borderWidth: borderWidth.hairline,
    borderColor: colors.glassBorder,
    borderRadius: radii.pill,
    backgroundColor: colors.glassStrong
  },

  amount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1]
  },

  value: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.sansBold,
    lineHeight: lineHeight.tight(fontSize.sm),
    color: colors.onFelt
  },

  divider: {
    width: borderWidth.hairline,
    height: fontSize.md,
    backgroundColor: colors.glassBorder
  }
});
