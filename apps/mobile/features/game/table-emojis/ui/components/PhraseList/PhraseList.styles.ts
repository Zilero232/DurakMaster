import { StyleSheet } from 'react-native';

import { borderWidth, colors, fontFamily, fontSize, radii, shadows, spacing } from '@/ui-kit';

export const styles = StyleSheet.create({
  root: {
    gap: spacing[2]
  },

  phrase: {
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    borderRadius: radii.md,
    borderWidth: borderWidth.hairline,
    borderColor: colors.border,
    backgroundColor: colors.surface2,
    ...shadows.tile
  },

  pressed: {
    backgroundColor: colors.surface3
  },

  label: {
    fontSize: fontSize.md,
    fontFamily: fontFamily.sansSemi,
    color: colors.foreground
  }
});
