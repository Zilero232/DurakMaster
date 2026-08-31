import { StyleSheet } from 'react-native';

import { colors, fontFamily, fontSize, radii, shadows, spacing } from '@/ui-kit';

export const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    gap: 2,
    padding: spacing[1],
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    borderRadius: radii.pill,
    backgroundColor: colors.backgroundBottom
  },

  option: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1,
    minWidth: 44,
    minHeight: 44,
    paddingVertical: spacing[1],
    paddingHorizontal: spacing[2],
    borderRadius: radii.pill,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 'auto'
  },

  optionActive: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderAccent,
    backgroundColor: colors.surface2,
    ...shadows.tile
  },

  label: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    fontFamily: fontFamily.sansSemi,
    color: colors.mutedForeground
  },

  labelWithHint: {
    fontSize: fontSize.md
  },

  labelActive: {
    fontWeight: '800',
    fontFamily: fontFamily.sansBold,
    color: colors.accent
  },

  hint: {
    fontSize: fontSize.xs,
    fontFamily: fontFamily.sans,
    color: colors.subtleForeground
  }
});
