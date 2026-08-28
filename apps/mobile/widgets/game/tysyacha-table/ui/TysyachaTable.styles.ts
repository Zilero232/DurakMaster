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

  stageArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },

  stage: {
    alignItems: 'center',
    gap: spacing[2],
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[5],
    borderRadius: radii.lg,
    borderWidth: borderWidth.hairline,
    borderColor: colors.glassBorder,
    backgroundColor: colors.glass
  },

  stageTitle: {
    fontSize: fontSize.lg,
    fontFamily: fontFamily.displayBold,
    color: colors.onFelt
  },

  stageHint: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.sans,
    color: colors.onFeltMuted
  },

  bids: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2]
  },

  score: {
    flexDirection: 'row',
    alignSelf: 'center',
    gap: spacing[4],
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[4],
    borderRadius: radii.pill,
    borderWidth: borderWidth.hairline,
    borderColor: colors.glassBorder,
    backgroundColor: colors.glass
  },

  scoreLabel: {
    fontSize: fontSize.xs,
    fontFamily: fontFamily.sans,
    color: colors.onFeltMuted
  },

  scoreValue: {
    fontSize: fontSize.lg,
    fontFamily: fontFamily.displayBold,
    color: colors.gold
  },

  footer: {
    gap: spacing[2],
    paddingBottom: spacing[2]
  }
});
