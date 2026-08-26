import { StyleSheet } from 'react-native';

import { colors, fontFamily, fontSize, spacing } from '@/ui-kit';

export const styles = StyleSheet.create({
  root: {
    gap: spacing[3]
  },

  title: {
    fontSize: fontSize.xs,
    fontWeight: '500',
    fontFamily: fontFamily.sans,
    color: colors.mutedForeground,
    textTransform: 'uppercase',
    letterSpacing: 0.6
  }
});
