import { StyleSheet } from 'react-native';

import { colors, fontFamily, fontSize, radii, spacing } from '@/ui-kit';

export const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: spacing[1]
  },

  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 3,
    paddingHorizontal: spacing[2],
    borderRadius: radii.pill,
    backgroundColor: colors.surface3
  },

  cheaters: {
    backgroundColor: colors.borderAccent
  },

  label: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    fontFamily: fontFamily.sansSemi,
    color: colors.mutedForeground
  },

  cheatersLabel: {
    color: colors.primaryForeground
  }
});
