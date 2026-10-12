import { StyleSheet } from 'react-native';

import { colors, fontSize, spacing, TAP_TARGET } from '@/ui-kit';

export const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3]
  },

  label: {
    fontSize: fontSize.md,
    color: colors.foreground
  },

  slider: {
    flex: 1,
    height: TAP_TARGET
  },

  value: {
    minWidth: 42,
    fontSize: fontSize.sm,
    color: colors.mutedForeground,
    textAlign: 'right'
  }
});
