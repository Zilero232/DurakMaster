import { StyleSheet } from 'react-native';

import { borderWidth, colors, fontFamily, fontSize, lineHeight, radii, spacing } from '@/ui-kit';

const INPUT_FONT_SIZE = 16;

export const styles = StyleSheet.create({
  root: {
    gap: spacing[2]
  },

  label: {
    fontSize: fontSize.xs,
    fontFamily: fontFamily.sansSemi,
    color: colors.mutedForeground,
    textTransform: 'uppercase',
    letterSpacing: 0.6
  },

  field: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    paddingHorizontal: spacing[4],
    borderWidth: borderWidth.regular,
    borderColor: colors.border,
    borderRadius: radii.md,
    backgroundColor: colors.backgroundBottom
  },

  fieldInvalid: {
    borderColor: colors.borderAccent
  },

  input: {
    flex: 1,
    height: '100%',
    fontSize: INPUT_FONT_SIZE,
    fontFamily: fontFamily.sans,
    color: colors.foreground
  },

  reveal: {
    paddingLeft: spacing[2]
  },

  error: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.sansSemi,
    lineHeight: lineHeight.normal(fontSize.sm),
    color: colors.accent
  }
});
