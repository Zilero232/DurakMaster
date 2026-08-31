import { StyleSheet } from 'react-native';

import { colors, fontFamily, fontSize, spacing } from '@/ui-kit';

export const styles = StyleSheet.create({
  root: {
    gap: spacing[5]
  },

  league: {
    alignItems: 'center',
    gap: spacing[1]
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
