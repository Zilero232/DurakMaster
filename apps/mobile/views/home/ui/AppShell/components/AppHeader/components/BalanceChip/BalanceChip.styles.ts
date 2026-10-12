import { StyleSheet } from 'react-native';

import { borderWidth, colors, fontFamily, fontSize, radii, spacing } from '@/ui-kit';

export const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    paddingVertical: spacing[1],
    paddingLeft: spacing[2],
    paddingRight: spacing[3],
    borderWidth: borderWidth.hairline,
    borderColor: colors.glassBorder,
    borderRadius: radii.pill,
    backgroundColor: colors.glassStrong
  },

  value: {
    fontSize: fontSize.md,
    fontFamily: fontFamily.sansBold,
    color: colors.onFelt,
    fontVariant: ['tabular-nums']
  }
});
