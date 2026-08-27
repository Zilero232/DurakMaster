import { StyleSheet } from 'react-native';

import { colors, fontFamily, fontSize, lineHeight, radii, spacing } from '@/ui-kit';

const TRACK_HEIGHT = 6;

export const styles = StyleSheet.create({
  root: {
    gap: spacing[2],
    padding: spacing[3],
    borderRadius: radii.md,
    backgroundColor: colors.surface2
  },

  locked: {
    opacity: 0.7
  },

  head: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3]
  },

  info: {
    flex: 1,
    gap: spacing[1],
    minWidth: 0
  },

  title: {
    fontSize: fontSize.md,
    fontFamily: fontFamily.sansBold,
    color: colors.foreground
  },

  description: {
    fontSize: fontSize.xs,
    fontFamily: fontFamily.sans,
    lineHeight: lineHeight.normal(fontSize.xs),
    color: colors.mutedForeground
  },

  reward: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    paddingVertical: spacing[1],
    paddingHorizontal: spacing[2],
    borderRadius: radii.pill,
    backgroundColor: colors.glassStrong
  },

  rewardValue: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.sansBold,
    color: colors.gold
  },

  track: {
    overflow: 'hidden',
    height: TRACK_HEIGHT,
    borderRadius: radii.pill,
    backgroundColor: colors.surface3
  },

  fill: {
    height: '100%',
    borderRadius: radii.pill,
    backgroundColor: colors.success
  },

  progress: {
    fontSize: fontSize.xs,
    fontFamily: fontFamily.sansSemi,
    color: colors.subtleForeground,
    textAlign: 'right'
  }
});
