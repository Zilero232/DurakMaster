import { StyleSheet } from 'react-native';

import { borderWidth, colors, fontFamily, fontSize, radii, spacing } from '@/ui-kit';

export const styles = StyleSheet.create({
  root: {
    gap: spacing[5]
  },

  section: {
    gap: spacing[3]
  },

  label: {
    fontSize: fontSize.md,
    fontFamily: fontFamily.sansBold,
    color: colors.foreground
  },

  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2]
  },

  input: {
    flex: 1,
    minWidth: 0,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    borderRadius: radii.md,
    borderWidth: borderWidth.hairline,
    borderColor: colors.border,
    backgroundColor: colors.backgroundBottom,
    fontSize: fontSize.md,
    fontFamily: fontFamily.sans,
    color: colors.foreground
  },

  upload: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
    paddingVertical: spacing[4],
    borderRadius: radii.md,
    borderWidth: borderWidth.regular,
    borderStyle: 'dashed',
    borderColor: colors.borderStrong,
    backgroundColor: colors.glass
  },

  uploadPressed: {
    borderColor: colors.accent,
    backgroundColor: colors.glassStrong
  },

  uploadLabel: {
    fontSize: fontSize.md,
    fontFamily: fontFamily.sansBold,
    color: colors.foreground
  },

  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3]
  },

  dividerLine: {
    flex: 1,
    height: borderWidth.hairline,
    backgroundColor: colors.border
  },

  dividerLabel: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.sans,
    color: colors.subtleForeground
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2]
  }
});
