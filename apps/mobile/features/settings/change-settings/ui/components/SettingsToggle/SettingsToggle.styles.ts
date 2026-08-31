import { StyleSheet } from 'react-native';

import { colors, fontFamily, fontSize, spacing } from '@/ui-kit';

export const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3]
  },

  text: {
    flex: 1,
    gap: 2
  },

  title: {
    fontSize: fontSize.md,
    fontFamily: fontFamily.sansBold,
    color: colors.foreground
  },

  description: {
    fontSize: fontSize.xs,
    lineHeight: fontSize.xs * 1.4,
    fontFamily: fontFamily.sans,
    color: colors.mutedForeground
  }
});
