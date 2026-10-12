import { StyleSheet } from 'react-native';

import { borderWidth, colors, fontFamily, fontSize, radii, spacing } from '@/ui-kit';

export const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[4],
    borderWidth: borderWidth.regular,
    borderRadius: radii.pill,
    backgroundColor: colors.glass
  },

  label: {
    fontSize: fontSize.lg,
    fontFamily: fontFamily.displayBold
  }
});
