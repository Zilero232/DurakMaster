import { StyleSheet } from 'react-native';

import { colors, fontFamily, fontSize, radii, spacing } from '@/ui-kit';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    minWidth: 0,
    alignItems: 'center',
    gap: spacing[1],
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[1],
    borderRadius: radii.md
  },

  value: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    fontFamily: fontFamily.displayBold,
    color: colors.onFelt
  },

  label: {
    fontSize: fontSize.xs,
    fontFamily: fontFamily.sansSemi,
    color: colors.onFeltMuted,
    textAlign: 'center'
  }
});
