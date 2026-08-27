import { StyleSheet } from 'react-native';

import { borderWidth, colors, fontFamily, fontSize, radii, spacing } from '@/ui-kit';

export const AVATAR_SIZE = 72;

export const styles = StyleSheet.create({
  root: {
    gap: spacing[4]
  },

  header: {
    alignItems: 'center',
    gap: spacing[2]
  },

  ring: {
    padding: spacing[1],
    borderWidth: borderWidth.regular,
    borderRadius: radii.pill,
    backgroundColor: colors.surface2
  },

  name: {
    fontSize: fontSize.xl,
    fontFamily: fontFamily.displayBold,
    color: colors.foreground
  },

  league: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.sansSemi
  },

  presence: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    paddingVertical: spacing[1],
    paddingHorizontal: spacing[3],
    borderRadius: radii.pill,
    backgroundColor: colors.surface2
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: radii.pill
  },

  online: {
    backgroundColor: colors.success
  },

  offline: {
    backgroundColor: colors.subtleForeground
  },

  presenceLabel: {
    fontSize: fontSize.xs,
    fontFamily: fontFamily.sans,
    color: colors.mutedForeground
  },

  stats: {
    gap: spacing[3],
    padding: spacing[4],
    borderRadius: radii.lg,
    borderWidth: borderWidth.hairline,
    borderColor: colors.border,
    backgroundColor: colors.surface2
  }
});
