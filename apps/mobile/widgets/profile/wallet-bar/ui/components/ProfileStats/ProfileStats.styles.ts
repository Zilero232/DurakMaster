import { StyleSheet } from 'react-native';

import { colors, fontSize, radii, spacing } from '@/ui-kit';

export const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    gap: spacing[2]
  },

  stat: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
    padding: spacing[2],
    borderRadius: radii.sm,
    backgroundColor: colors.surface2
  },

  label: {
    fontSize: fontSize.xs,
    color: colors.mutedForeground,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.3
  },

  value: {
    fontSize: fontSize.xl,
    color: colors.foreground,
    textAlign: 'center'
  }
});
