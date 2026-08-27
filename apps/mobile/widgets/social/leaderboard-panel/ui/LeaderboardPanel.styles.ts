import { StyleSheet } from 'react-native';

import { colors, fontFamily, fontSize, radii, spacing } from '@/ui-kit';

export const styles = StyleSheet.create({
  root: {
    gap: spacing[3]
  },

  myRank: {
    alignItems: 'center',
    gap: spacing[1],
    padding: spacing[4],
    borderRadius: radii.lg,
    backgroundColor: colors.surface2
  },

  myRankValue: {
    fontSize: fontSize.xxl,
    fontFamily: fontFamily.displayBold,
    color: colors.accent
  },

  myRankLabel: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.sansSemi,
    color: colors.mutedForeground
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    padding: spacing[3],
    borderRadius: radii.md,
    backgroundColor: colors.surface2
  },

  podium: {
    backgroundColor: colors.glassStrong
  },

  rank: {
    minWidth: 28,
    fontSize: fontSize.md,
    fontFamily: fontFamily.displayBold,
    color: colors.subtleForeground,
    textAlign: 'center'
  },

  rankPodium: {
    color: colors.gold
  },

  name: {
    flex: 1,
    fontSize: fontSize.md,
    fontFamily: fontFamily.sansSemi,
    color: colors.foreground
  },

  rating: {
    fontSize: fontSize.md,
    fontFamily: fontFamily.sansBold,
    color: colors.gold
  },

  empty: {
    paddingVertical: spacing[8],
    fontSize: fontSize.sm,
    fontFamily: fontFamily.sans,
    color: colors.mutedForeground,
    textAlign: 'center'
  }
});
