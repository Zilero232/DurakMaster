import { StyleSheet } from 'react-native';

import { borderWidth, colors, fontFamily, fontSize, spacing } from '@/ui-kit';

export const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2]
  },

  avatars: {
    flexDirection: 'row',
    paddingRight: spacing[2]
  },

  avatar: {
    marginRight: -spacing[2],
    borderWidth: borderWidth.regular,
    borderColor: colors.surface1
  },

  names: {
    flexShrink: 1,
    fontSize: fontSize.md,
    fontFamily: fontFamily.sansSemi,
    color: colors.foreground
  },

  empty: {
    color: colors.mutedForeground
  }
});
