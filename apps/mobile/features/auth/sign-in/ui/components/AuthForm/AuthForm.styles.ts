import { StyleSheet } from 'react-native';

import { colors, fontFamily, fontSize, lineHeight, spacing } from '@/ui-kit';

export const styles = StyleSheet.create({
  root: {
    gap: spacing[4]
  },

  hero: {
    alignItems: 'center',
    gap: spacing[2],
    marginBottom: spacing[2]
  },

  title: {
    fontSize: fontSize.xxl,
    fontFamily: fontFamily.displayBold,
    color: colors.foreground,
    textAlign: 'center'
  },

  subtitle: {
    fontSize: fontSize.md,
    fontFamily: fontFamily.sans,
    lineHeight: lineHeight.normal(fontSize.md),
    color: colors.mutedForeground,
    textAlign: 'center'
  },

  error: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.sansSemi,
    color: colors.accent
  },

  submit: {
    marginTop: spacing[2]
  }
});
