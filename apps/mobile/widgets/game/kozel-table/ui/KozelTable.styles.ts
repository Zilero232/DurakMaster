import { StyleSheet } from 'react-native';

import { borderWidth, colors, fontFamily, fontSize, radii, spacing } from '@/ui-kit';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center'
  },

  table: {
    flex: 1,
    gap: spacing[2],
    paddingHorizontal: spacing[3],
    paddingBottom: spacing[2]
  },

  footer: {
    gap: spacing[2],
    paddingBottom: spacing[2]
  },

  choiceArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },

  choice: {
    alignItems: 'center',
    gap: spacing[3],
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[5],
    borderRadius: radii.lg,
    borderWidth: borderWidth.hairline,
    borderColor: colors.glassBorder,
    backgroundColor: colors.glass
  },

  choiceTitle: {
    fontSize: fontSize.lg,
    fontFamily: fontFamily.displayBold,
    color: colors.onFelt
  },

  choiceHint: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.sans,
    color: colors.onFeltMuted
  },

  choiceButtons: {
    flexDirection: 'row',
    gap: spacing[2]
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
