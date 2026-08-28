import { StyleSheet } from 'react-native';

import { colors, fontFamily, fontSize, radii, spacing } from '@/ui-kit';

export const styles = StyleSheet.create({
  root: {
    gap: spacing[3],
    padding: spacing[4],
    borderRadius: radii.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    backgroundColor: colors.surface1
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

  more: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[3],
    borderRadius: radii.pill,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderStrong
  },

  morePressed: {
    backgroundColor: colors.glass
  },

  moreLabel: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    fontFamily: fontFamily.sansBold,
    color: colors.onFelt
  },

  tiles: {
    flexDirection: 'row',
    gap: spacing[2]
  }
});
