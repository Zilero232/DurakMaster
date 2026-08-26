import { StyleSheet } from 'react-native';

import { colors, fontFamily, fontSize, spacing } from '@/ui-kit';

export const styles = StyleSheet.create({
  root: {
    gap: spacing[2],
    minWidth: 0
  },

  inRow: {
    flex: 1
  },

  title: {
    fontSize: fontSize.lg,
    fontWeight: '800',
    fontFamily: fontFamily.sansBold,
    color: colors.onFelt
  }
});
