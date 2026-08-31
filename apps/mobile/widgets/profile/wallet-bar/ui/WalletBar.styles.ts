import { StyleSheet } from 'react-native';

import { colors, fontFamily, fontSize, radii, shadows, spacing } from '@/ui-kit';

export const styles = StyleSheet.create({
  root: {
    gap: spacing[3]
  },

  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing[4]
  },

  wallets: {
    flexShrink: 0,
    gap: spacing[2]
  },

  bonus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
    padding: spacing[3],
    borderRadius: radii.md,
    backgroundColor: colors.success,
    overflow: 'hidden',
    ...shadows.button
  },

  bonusFill: {
    position: 'absolute',
    zIndex: -1,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  },

  bonusWaiting: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    backgroundColor: colors.backgroundBottom,
    boxShadow: 'none',
    elevation: 0
  },

  bonusWaitingLabel: {
    color: colors.mutedForeground
  },

  bonusPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }]
  },

  bonusLabel: {
    fontSize: fontSize.md,
    fontWeight: '700',
    fontFamily: fontFamily.sansBold,
    color: colors.primaryForeground
  },

  progressTrack: {
    overflow: 'hidden',
    height: 6,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    borderRadius: radii.pill,
    backgroundColor: colors.backgroundBottom
  },

  progressFill: {
    height: '100%',
    borderRadius: radii.pill
  }
});
