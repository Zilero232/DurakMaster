import { StyleSheet } from 'react-native';

import { colors, fontFamily, fontSize, lineHeight, spacing } from '../../theme';

export const styles = StyleSheet.create({
  root: {
    gap: spacing[3]
  },

  title: {
    fontSize: fontSize.lg,
    fontFamily: fontFamily.sansBold,
    color: colors.foreground
  },

  message: {
    fontSize: fontSize.md,
    fontFamily: fontFamily.sans,
    lineHeight: lineHeight.normal(fontSize.md),
    color: colors.mutedForeground
  },

  actions: {
    flexDirection: 'row',
    gap: spacing[3],
    marginTop: spacing[1]
  },

  action: {
    flex: 1
  }
});
