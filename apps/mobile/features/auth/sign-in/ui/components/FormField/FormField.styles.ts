import { StyleSheet } from 'react-native';

import { colors, fontFamily, fontSize, radii, spacing } from '@/ui-kit';

export const styles = StyleSheet.create({
  root: {
    gap: spacing[2]
  },

  label: {
    fontSize: fontSize.xs,
    fontWeight: '500',
    fontFamily: fontFamily.sans,
    color: colors.mutedForeground,
    textTransform: 'uppercase',
    letterSpacing: 0.6
  },

  input: {
    height: 50,
    paddingHorizontal: spacing[4],
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: radii.md,
    fontSize: 16,
    color: colors.foreground,
    backgroundColor: colors.surface2
  },

  inputInvalid: {
    borderColor: colors.borderAccent
  }
});
