import { StyleSheet } from 'react-native';

import { colors, fontFamily, fontSize, lineHeight, spacing } from '@/ui-kit';

export const styles = StyleSheet.create({
  root: {
    gap: spacing[3]
  },

  intro: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.sans,
    lineHeight: lineHeight.relaxed(fontSize.sm),
    color: colors.mutedForeground
  }
});
