import { StyleSheet } from 'react-native';

import { colors, fontFamily, fontSize, lineHeight, spacing } from '@/ui-kit';

export const styles = StyleSheet.create({
  root: {
    gap: spacing[4],
    paddingBottom: spacing[2]
  },

  text: {
    color: colors.mutedForeground,
    fontFamily: fontFamily.sans,
    fontSize: fontSize.md,
    lineHeight: lineHeight.normal(fontSize.md)
  },

  actions: {
    flexDirection: 'row',
    gap: spacing[3]
  },

  action: {
    flex: 1
  }
});
