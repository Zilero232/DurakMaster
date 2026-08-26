import { StyleSheet } from 'react-native';

import { colors, fontFamily, fontSize, radii, shadows, spacing } from '@/ui-kit';

export const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    gap: spacing[1],
    minWidth: 44,
    paddingTop: spacing[1],
    paddingHorizontal: spacing[2],
    paddingBottom: spacing[1],
    borderRadius: radii.pill,
    backgroundColor: colors.surface1,
    ...shadows.card
  },

  warn: {
    backgroundColor: colors.accent
  },

  value: {
    fontSize: fontSize.md,
    fontWeight: '700',
    fontFamily: fontFamily.sansBold,
    color: colors.foreground
  },

  warnValue: {
    color: colors.surface1
  },

  track: {
    width: '100%',
    height: 3,
    borderRadius: radii.pill,
    backgroundColor: colors.surface3,
    overflow: 'hidden'
  },

  fill: {
    height: '100%',
    borderRadius: radii.pill,
    backgroundColor: colors.accent
  },

  warnFill: {
    backgroundColor: colors.surface1
  }
});
