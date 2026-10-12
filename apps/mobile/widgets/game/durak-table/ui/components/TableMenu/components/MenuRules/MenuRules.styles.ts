import { StyleSheet } from 'react-native';

import { borderWidth, colors, fontFamily, fontSize, spacing } from '@/ui-kit';

export const styles = StyleSheet.create({
  root: {
    gap: spacing[1]
  },

  title: {
    marginBottom: spacing[1],
    fontSize: fontSize.sm,
    fontFamily: fontFamily.sansBold,
    color: colors.mutedForeground,
    textTransform: 'uppercase'
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    paddingVertical: spacing[2],
    borderBottomWidth: borderWidth.hairline,
    borderBottomColor: colors.border
  },

  label: {
    flex: 1,
    fontSize: fontSize.md,
    fontFamily: fontFamily.sans,
    color: colors.foreground
  },

  value: {
    flexShrink: 1,
    fontSize: fontSize.md,
    fontFamily: fontFamily.sansBold,
    color: colors.foreground,
    textAlign: 'right'
  }
});
