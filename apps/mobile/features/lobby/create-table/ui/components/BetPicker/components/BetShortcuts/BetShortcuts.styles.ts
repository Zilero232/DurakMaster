import { StyleSheet } from 'react-native';

import { colors, fontFamily, fontSize, radii, shadows, spacing } from '@/ui-kit';

export const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    gap: spacing[2]
  },

  step: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: colors.transparent,
    borderRadius: radii.pill,
    backgroundColor: colors.surface1,
    overflow: 'hidden',
    ...shadows.tile
  },

  stepActive: {
    borderColor: colors.gold,
    backgroundColor: colors.goldBright,
    ...shadows.button
  },

  fill: {
    position: 'absolute',
    zIndex: -1,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
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
