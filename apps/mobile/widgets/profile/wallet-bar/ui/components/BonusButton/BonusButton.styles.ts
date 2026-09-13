import { StyleSheet } from 'react-native';

import { colors, fontFamily, fontSize, opacity, radii, shadows, spacing } from '@/ui-kit';

export const styles = StyleSheet.create({
  root: {
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

  fill: {
    position: 'absolute',
    zIndex: -1,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  },

  waiting: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    backgroundColor: colors.backgroundBottom,
    boxShadow: 'none',
    elevation: 0
  },

  waitingLabel: {
    color: colors.mutedForeground
  },

  pressed: {
    opacity: opacity.muted,
    transform: [{ scale: 0.98 }]
  },

  label: {
    fontSize: fontSize.md,
    fontWeight: '700',
    fontFamily: fontFamily.sansBold,
    color: colors.primaryForeground
  }
});
