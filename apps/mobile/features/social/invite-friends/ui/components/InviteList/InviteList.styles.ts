import { StyleSheet } from 'react-native';

import { colors, fontFamily, fontSize, spacing } from '@/ui-kit';

export const styles = StyleSheet.create({
  loading: {
    alignItems: 'center',
    paddingVertical: spacing[8]
  },

  list: {
    gap: spacing[2]
  },

  note: {
    paddingTop: spacing[2],
    fontSize: fontSize.sm,
    fontFamily: fontFamily.sans,
    color: colors.mutedForeground,
    textAlign: 'center'
  }
});
