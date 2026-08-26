import { StyleSheet } from 'react-native';

import { colors, fontFamily, fontSize, radii, shadows, spacing } from '@/ui-kit';

export const styles = StyleSheet.create({
  root: {
    gap: spacing[3]
  },

  header: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: spacing[3]
  },

  label: {
    fontSize: fontSize.lg,
    fontWeight: '800',
    fontFamily: fontFamily.sansBold,
    color: colors.onFelt
  },

  value: {
    fontSize: fontSize.xxl,
    fontWeight: '800',
    fontFamily: fontFamily.displayBold,
    color: colors.goldBright
  },

  steps: {
    gap: spacing[2],
    paddingVertical: spacing[1]
  },

  step: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 64,
    height: 44,
    paddingHorizontal: spacing[3],
    borderWidth: 2,
    borderColor: colors.transparent,
    borderRadius: radii.pill,
    backgroundColor: colors.surface1,
    ...shadows.tile
  },

  stepActive: {
    borderColor: colors.gold,
    backgroundColor: colors.goldBright
  },

  stepLabel: {
    fontSize: fontSize.md,
    fontWeight: '700',
    fontFamily: fontFamily.sansBold,
    color: colors.mutedForeground
  },

  stepLabelActive: {
    color: colors.goldDeep
  }
});
