import { StyleSheet } from 'react-native';

import { colors, fontSize, spacing } from '@/ui-kit';

export const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3]
  },

  text: {
    flex: 1,
    gap: 2
  },

  title: {
    fontSize: fontSize.md,
    color: colors.foreground
  },

  description: {
    fontSize: fontSize.sm,
    lineHeight: fontSize.sm * 1.4,
    color: colors.subtleForeground
  }
});
