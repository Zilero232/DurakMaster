import { StyleSheet } from 'react-native';

import { colors, fontFamily, fontSize, radii, shadows, spacing } from '@/ui-kit';

export const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFill,
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[4],
    backgroundColor: colors.scrim
  },

  panel: {
    gap: spacing[3],
    width: '100%',
    maxWidth: 360,
    paddingVertical: spacing[8],
    paddingHorizontal: spacing[6],
    borderRadius: radii.xl,
    backgroundColor: colors.surfaceOverlay,
    ...shadows.panel
  },

  title: {
    fontSize: fontSize.display,
    fontWeight: '800',
    fontFamily: fontFamily.displayBold,
    textAlign: 'center'
  },

  win: {
    color: colors.gold
  },

  lose: {
    color: colors.accent
  },

  draw: {
    color: colors.foreground
  },

  subtitle: {
    marginBottom: spacing[2],
    fontSize: fontSize.sm,
    color: colors.mutedForeground,
    textAlign: 'center'
  },

  deltas: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing[3],
    marginBottom: spacing[2]
  },

  delta: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    fontFamily: fontFamily.sansBold,
    color: colors.accent
  },

  positive: {
    color: colors.success
  },

  rating: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    fontFamily: fontFamily.sansBold,
    color: colors.goldDim
  },

  actions: {
    gap: spacing[2]
  }
});
