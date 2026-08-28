import { StyleSheet } from 'react-native';

import { borderWidth, colors, fontFamily, fontSize, radii, spacing } from '@/ui-kit';

export const AVATAR_SIZE = 88;

export const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    gap: spacing[2],
    paddingVertical: spacing[4],
    borderRadius: radii.lg,
    backgroundColor: colors.surface2
  },

  ring: {
    padding: spacing[1],
    borderWidth: borderWidth.regular,
    borderColor: colors.accent,
    borderRadius: radii.pill,
    backgroundColor: colors.surface1
  },

  name: {
    fontSize: fontSize.lg,
    fontFamily: fontFamily.displayBold,
    color: colors.foreground
  },

  meta: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.sans,
    color: colors.mutedForeground
  }
});
