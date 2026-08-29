import { StyleSheet } from 'react-native';

import { colors, fontFamily, fontSize, lineHeight, spacing } from '@/ui-kit';

export const styles = StyleSheet.create({
  sections: {
    gap: spacing[5]
  },

  section: {
    gap: spacing[2]
  },

  heading: {
    fontSize: fontSize.lg,
    fontFamily: fontFamily.sansBold,
    color: colors.accent
  },

  text: {
    fontSize: fontSize.md,
    fontFamily: fontFamily.sans,

    lineHeight: lineHeight.relaxed(fontSize.md),
    color: colors.mutedForeground
  }
});
