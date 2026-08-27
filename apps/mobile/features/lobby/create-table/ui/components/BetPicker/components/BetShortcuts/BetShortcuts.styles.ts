import { StyleSheet } from 'react-native';

import { colors, fontFamily, fontSize, radii, spacing } from '@/ui-kit';

export const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    gap: spacing[2]
  },

  step: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 36,
    borderWidth: 2,
    borderColor: colors.transparent,
    borderRadius: radii.pill,
    backgroundColor: colors.surface1
  },

  stepActive: {
    borderColor: colors.gold,
    backgroundColor: colors.goldBright
  },

  stepLabel: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    fontFamily: fontFamily.sansBold,
    color: colors.mutedForeground
  },

  stepLabelActive: {
    color: colors.goldDeep
  }
});
