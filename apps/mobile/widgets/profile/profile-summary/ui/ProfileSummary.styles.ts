import { StyleSheet } from 'react-native';

import { colors, fontFamily, fontSize, opacity, spacing } from '@/ui-kit';

export const styles = StyleSheet.create({
  root: {
    gap: spacing[3]
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing[3]
  },

  league: {
    flex: 1,
    minWidth: 0,
    gap: spacing[1]
  },

  leagueName: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    fontFamily: fontFamily.displayBold
  },

  leagueLevel: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.sansSemi,
    color: colors.onFeltMuted
  },

  pressed: {
    opacity: opacity.muted,
    transform: [{ scale: 0.99 }]
  },

  tiles: {
    flexDirection: 'row',
    gap: spacing[2]
  }
});
