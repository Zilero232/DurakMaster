import { StyleSheet } from 'react-native';

import { colors, fontFamily, fontSize, radii, spacing } from '@/ui-kit';

export const styles = StyleSheet.create({
  root: {
    gap: spacing[5]
  },

  league: {
    alignItems: 'center',
    gap: spacing[1],
    padding: spacing[4],
    borderRadius: radii.lg,
    backgroundColor: colors.surface2
  },

  leagueName: {
    fontSize: fontSize.xl,
    fontFamily: fontFamily.displayBold
  },

  leagueLevel: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.sansSemi,
    color: colors.mutedForeground
  },

  rows: {
    gap: spacing[4]
  }
});
