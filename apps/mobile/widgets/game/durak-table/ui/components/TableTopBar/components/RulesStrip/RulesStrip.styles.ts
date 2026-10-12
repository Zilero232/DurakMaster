import { StyleSheet } from 'react-native';

import { borderWidth, colors, fontFamily, fontSize, radii, spacing, TAP_TARGET } from '@/ui-kit';

export const styles = StyleSheet.create({
  root: {
    flexShrink: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    minHeight: TAP_TARGET,
    paddingHorizontal: spacing[3],
    overflow: 'hidden',
    borderWidth: borderWidth.hairline,
    borderColor: colors.glassBorder,
    borderRadius: radii.pill,
    backgroundColor: colors.glass
  },

  pressed: {
    backgroundColor: colors.glassStrong
  },

  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1]
  },

  text: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.sansBold,
    color: colors.onFelt
  }
});
