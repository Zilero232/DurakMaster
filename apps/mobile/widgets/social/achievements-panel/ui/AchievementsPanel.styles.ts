import { StyleSheet } from 'react-native';

import { colors, fontFamily, fontSize, radii, spacing } from '@/ui-kit';

export const styles = StyleSheet.create({
  root: {
    gap: spacing[4]
  },

  summary: {
    alignItems: 'center',
    gap: spacing[1],
    padding: spacing[4],
    borderRadius: radii.lg,
    backgroundColor: colors.surface2
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
