import { StyleSheet } from 'react-native';

import { borderWidth, colors, fontFamily, fontSize, radii, spacing, TAP_TARGET } from '@/ui-kit';

export const styles = StyleSheet.create({
  root: {
    gap: spacing[3]
  },

  toggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    minHeight: TAP_TARGET,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    borderWidth: borderWidth.hairline,
    borderColor: colors.border,
    borderRadius: radii.lg,
    backgroundColor: colors.surface1
  },

  togglePressed: {
    backgroundColor: colors.surface2
  },

  text: {
    flex: 1,
    minWidth: 0,
    gap: spacing[1]
  },

  title: {
    fontSize: fontSize.md,
    fontFamily: fontFamily.sansBold,
    color: colors.foreground
  },

  summary: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.sans,
    color: colors.mutedForeground
  },

  sections: {
    gap: spacing[3]
  }
});
