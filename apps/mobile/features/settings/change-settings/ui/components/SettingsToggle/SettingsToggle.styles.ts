import { StyleSheet } from 'react-native';

import { borderWidth, colors, fontFamily, fontSize, radii, spacing } from '@/ui-kit';

export const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    padding: spacing[4],
    borderRadius: radii.lg,
    borderWidth: borderWidth.hairline,
    borderColor: colors.border,
    backgroundColor: colors.surface2
  },

  text: {
    flex: 1,
    gap: 2
  },

  title: {
    fontSize: fontSize.md,
    fontFamily: fontFamily.sansBold,
    color: colors.foreground
  },

  description: {
    fontSize: fontSize.xs,
    lineHeight: fontSize.xs * 1.4,
    fontFamily: fontFamily.sans,
    color: colors.mutedForeground
  }
});
