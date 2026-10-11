import { StyleSheet } from 'react-native';

import { colors, fontSize, spacing } from '@/ui-kit';

export const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: spacing[2]
  },

  amount: {
    minWidth: 64,
    fontSize: fontSize.lg,
    color: colors.accent,
    textAlign: 'right'
  }
});
