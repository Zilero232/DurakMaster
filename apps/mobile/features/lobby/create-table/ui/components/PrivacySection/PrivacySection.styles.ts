import { StyleSheet } from 'react-native';

import { borderWidth, colors, fontFamily, fontSize, radii, spacing } from '@/ui-kit';

export const styles = StyleSheet.create({
  root: {
    gap: spacing[3]
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3]
  },

  label: {
    flex: 1,
    minWidth: 0,
    fontSize: fontSize.md,
    fontWeight: '700',
    fontFamily: fontFamily.sansBold,
    color: colors.onFelt
  },

  password: {
    height: 48,
    paddingHorizontal: spacing[4],
    borderWidth: borderWidth.hairline,
    borderColor: colors.borderStrong,
    borderRadius: radii.md,
    fontSize: fontSize.md,
    fontFamily: fontFamily.sansSemi,
    color: colors.foreground,
    backgroundColor: colors.backgroundDeep
  },

  passwordInvalid: {
    borderColor: colors.danger
  },

  passwordFocused: {
    borderColor: colors.accent
  },

  error: {
    fontSize: fontSize.xs,
    fontFamily: fontFamily.sans,
    color: colors.danger
  }
});
