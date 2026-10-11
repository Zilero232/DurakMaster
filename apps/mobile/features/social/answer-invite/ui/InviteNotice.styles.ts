import { StyleSheet } from 'react-native';

import { colors, fontFamily, fontSize, spacing } from '@/ui-kit';

export const AVATAR_SIZE = 64;

export const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    gap: spacing[3],
    paddingVertical: spacing[4]
  },

  text: {
    fontSize: fontSize.lg,
    fontFamily: fontFamily.sansBold,
    color: colors.foreground,
    textAlign: 'center'
  },

  bet: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.sans,
    color: colors.mutedForeground,
    textAlign: 'center'
  },

  actions: {
    flexDirection: 'row',
    gap: spacing[3]
  },

  action: {
    flex: 1
  }
});
