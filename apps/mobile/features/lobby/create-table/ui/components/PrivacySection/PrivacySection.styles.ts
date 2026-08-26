import { StyleSheet } from 'react-native';

import { colors, fontFamily, fontSize, radii, shadows, spacing } from '@/ui-kit';

export const styles = StyleSheet.create({
  root: {
    gap: spacing[3]
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing[3]
  },

  label: {
    flex: 1,
    fontSize: fontSize.lg,
    fontWeight: '700',
    fontFamily: fontFamily.sansBold,
    color: colors.onFelt
  },

  password: {
    height: 50,
    paddingHorizontal: spacing[4],
    borderWidth: 2,
    borderColor: colors.transparent,
    borderRadius: radii.md,
    fontSize: fontSize.md,
    color: colors.foreground,
    backgroundColor: colors.surface1,
    ...shadows.tile
  }
});
