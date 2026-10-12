import { StyleSheet } from 'react-native';

import { borderWidth, colors, fontFamily, fontSize, radii, spacing, TAP_TARGET } from '@/ui-kit';

export const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[1],
    minWidth: TAP_TARGET,
    height: TAP_TARGET,
    paddingHorizontal: spacing[3],
    borderWidth: borderWidth.hairline,
    borderColor: colors.glassBorder,
    borderRadius: radii.pill,
    backgroundColor: colors.glass
  },

  pressed: {
    backgroundColor: colors.glassStrong
  },

  code: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.sansBold,
    color: colors.onFelt
  }
});
