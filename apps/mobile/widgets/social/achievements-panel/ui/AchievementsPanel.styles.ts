import { StyleSheet } from 'react-native';

import { colors, fontFamily, fontSize, spacing } from '@/ui-kit';

export const styles = StyleSheet.create({
  root: {
    gap: spacing[4]
  },

  summary: {
    alignItems: 'center',
    gap: spacing[1]
  },

  summaryValue: {
    fontSize: fontSize.xxl,
    fontFamily: fontFamily.displayBold,
    color: colors.gold
  },

  summaryLabel: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.sansSemi,
    color: colors.mutedForeground
  },

  list: {
    gap: spacing[2]
  }
});
