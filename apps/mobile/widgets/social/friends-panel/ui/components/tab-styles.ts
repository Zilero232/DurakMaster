import { StyleSheet } from 'react-native';

import { colors, fontFamily, fontSize, spacing } from '@/ui-kit';

export const tabStyles = StyleSheet.create({
  list: {
    gap: spacing[2]
  },

  empty: {
    paddingVertical: spacing[8],
    fontSize: fontSize.sm,
    fontFamily: fontFamily.sans,
    color: colors.mutedForeground,
    textAlign: 'center'
  }
});
