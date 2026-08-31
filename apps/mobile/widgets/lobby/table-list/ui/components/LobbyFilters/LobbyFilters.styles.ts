import { StyleSheet } from 'react-native';

import { borderWidth, colors, fontFamily, fontSize, radii, shadows, spacing } from '@/ui-kit';

export const styles = StyleSheet.create({
  root: {
    gap: spacing[2],
    paddingTop: spacing[3],
    paddingHorizontal: spacing[4]
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2]
  },

  chips: {
    gap: spacing[2],
    paddingRight: spacing[4]
  },

  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    minHeight: 36,
    paddingHorizontal: spacing[3],
    borderWidth: borderWidth.hairline,
    borderColor: colors.border,
    borderRadius: radii.pill,
    backgroundColor: colors.surface1,
    ...shadows.tile
  },

  chipActive: {
    borderColor: colors.borderGold,
    backgroundColor: colors.accent,
    ...shadows.button
  },

  chipLabel: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.sansSemi,
    color: colors.mutedForeground
  },

  chipLabelActive: {
    color: colors.primaryForeground
  },

  count: {
    fontSize: fontSize.xs,
    fontFamily: fontFamily.sansSemi,
    color: colors.onFeltMuted
  }
});
