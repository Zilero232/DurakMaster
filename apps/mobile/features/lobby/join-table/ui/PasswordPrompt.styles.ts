import { StyleSheet } from 'react-native';

import { colors, fontFamily, fontSize, radii, spacing } from '@/ui-kit';

export const styles = StyleSheet.create({
  table: {
    fontSize: fontSize.sm,
    color: colors.mutedForeground,
    textAlign: 'center'
  },

  input: {
    height: 52,
    paddingHorizontal: spacing[4],
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: radii.md,
    fontSize: fontSize.lg,
    fontWeight: '600',
    fontFamily: fontFamily.sansSemi,
    color: colors.foreground,
    textAlign: 'center',
    letterSpacing: 1,
    backgroundColor: colors.backgroundBottom
  }
});
