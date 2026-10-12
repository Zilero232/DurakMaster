import { StyleSheet } from 'react-native';

import { colors, fontFamily, fontSize, lineHeight, spacing } from '@/ui-kit';

export const styles = StyleSheet.create({
  body: {
    gap: spacing[5]
  },

  warning: {
    fontSize: fontSize.md,
    lineHeight: lineHeight.normal(fontSize.md),
    fontFamily: fontFamily.sans,
    color: colors.foreground
  }
});
