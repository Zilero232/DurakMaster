import { StyleSheet } from 'react-native';

import { colors, fontFamily, fontSize, radii, shadows, spacing } from '@/ui-kit';

export const styles = StyleSheet.create({
  root: {
    gap: spacing[3],
    padding: spacing[4],
    borderRadius: radii.lg,
    backgroundColor: colors.surfaceOverlay,
    ...shadows.panel
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
    ...shadows.button
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
    borderRadius: radii.pill,
    backgroundColor: colors.surface3
  },

  progressFill: {
    height: '100%',
    borderRadius: radii.pill
  }
});
