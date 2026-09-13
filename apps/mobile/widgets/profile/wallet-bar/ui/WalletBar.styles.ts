import { StyleSheet } from 'react-native';

import { colors, radii, spacing } from '@/ui-kit';

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
