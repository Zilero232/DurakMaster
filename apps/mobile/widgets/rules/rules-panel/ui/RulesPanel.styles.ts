import { StyleSheet } from 'react-native';

import { colors, fontFamily, fontSize, spacing } from '@/ui-kit';

export const styles = StyleSheet.create({
  sections: {
    gap: spacing[5]
  },

  section: {
    gap: spacing[2]
  },

  heading: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    fontFamily: fontFamily.sansBold,
    color: colors.accent
  },

  text: {
    fontSize: fontSize.md,
    lineHeight: 22,
    color: colors.mutedForeground
  }
});
