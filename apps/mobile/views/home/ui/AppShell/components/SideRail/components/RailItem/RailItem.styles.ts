import { StyleSheet } from 'react-native';

import { borderWidth, colors, fontFamily, fontSize, radii, spacing } from '@/ui-kit';

export const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[3],
    borderWidth: borderWidth.hairline,
    borderColor: colors.transparent,
    borderRadius: radii.md
  },

  pressed: {
    backgroundColor: colors.glass
  },

  active: {
    borderColor: colors.borderGold,
    backgroundColor: colors.glassStrong
  },

  label: {
    flex: 1,
    fontSize: fontSize.md,
    fontFamily: fontFamily.sansSemi,
    color: colors.onFeltMuted
  },

  labelActive: {
    fontFamily: fontFamily.sansBold,
    color: colors.gold
  }
});
