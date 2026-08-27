import { StyleSheet } from 'react-native';

import { colors, fontFamily, fontSize, radii, spacing } from '@/ui-kit';

export const styles = StyleSheet.create({
  root: {
    gap: spacing[4]
  },

  group: {
    gap: spacing[2]
  },

  options: {
    flexDirection: 'row',
    gap: spacing[2]
  },

  groupTitle: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.sansSemi,
    color: colors.mutedForeground
  },

  toggles: {
    gap: spacing[1],
    paddingTop: spacing[2],
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border
  },

  toggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[2],
    borderRadius: radii.md
  },

  togglePressed: {
    backgroundColor: colors.glass
  },

  toggleText: {
    flex: 1,
    minWidth: 0,
    gap: 2
  },

  toggleLabel: {
    fontSize: fontSize.md,
    fontFamily: fontFamily.sansSemi,
    color: colors.foreground
  },

  toggleHint: {
    fontSize: fontSize.xs,
    fontFamily: fontFamily.sans,
    color: colors.subtleForeground
  }
});
