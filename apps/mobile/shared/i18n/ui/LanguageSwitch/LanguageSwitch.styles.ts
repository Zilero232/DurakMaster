import { StyleSheet } from 'react-native';

import { borderWidth, colors, fontFamily, fontSize, radii, spacing } from '@/ui-kit';

export const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignSelf: 'center',
    gap: spacing[1],
    padding: spacing[1],
    borderRadius: radii.pill,
    borderWidth: borderWidth.hairline,
    borderColor: colors.glassBorder,
    backgroundColor: colors.glass
  },

  option: {
    paddingVertical: spacing[1],
    paddingHorizontal: spacing[3],
    borderRadius: radii.pill
  },

  optionActive: {
    backgroundColor: colors.glassStrong
  },

  label: {
    fontSize: fontSize.xs,
    fontFamily: fontFamily.sans,
    color: colors.mutedForeground
  },

  labelActive: {
    fontFamily: fontFamily.sansBold,
    color: colors.onFelt
  }
});
