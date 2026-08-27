import { StyleSheet } from 'react-native';

import { borderWidth, colors, fontFamily, fontSize, radii, spacing } from '@/ui-kit';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center'
  },

  table: {
    flex: 1,
    justifyContent: 'space-between'
  },

  score: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    gap: spacing[4],
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[4],
    borderRadius: radii.pill,
    borderWidth: borderWidth.hairline,
    borderColor: colors.glassBorder,
    backgroundColor: colors.glass
  },

  team: {
    alignItems: 'center'
  },

  teamLabel: {
    fontSize: fontSize.xs,
    fontFamily: fontFamily.sans,
    color: colors.onFeltMuted
  },

  teamValue: {
    fontSize: fontSize.lg,
    fontFamily: fontFamily.displayBold,
    color: colors.onFelt
  },

  mine: {
    color: colors.accentBright
  },

  hand: {
    paddingBottom: spacing[4]
  }
});
