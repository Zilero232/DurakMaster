import { StyleSheet } from 'react-native';

import { colors, fontFamily, fontSize, iconSize, radii, spacing } from '@/ui-kit';

export const BADGE_ICON_SIZE = iconSize.xs;

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
    gap: spacing[1],
    paddingVertical: spacing[1],
    paddingHorizontal: spacing[2],
    borderRadius: radii.pill,
    backgroundColor: colors.surface3
  },

  gameBadge: {
    backgroundColor: colors.glassStrong
  },

  cheaters: {
    backgroundColor: colors.accentDim
  },

  label: {
    fontSize: fontSize.xs,
    fontFamily: fontFamily.sansSemi,
    color: colors.mutedForeground
  },

  gameLabel: {
    fontFamily: fontFamily.sansBold,
    color: colors.foreground
  },

  cheatersLabel: {
    color: colors.primaryForeground
  }
});
