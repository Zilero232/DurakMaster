import { StyleSheet } from 'react-native';

import { colors, fontFamily, fontSize, spacing } from '@/ui-kit';

export const styles = StyleSheet.create({
  root: {
    gap: spacing[5],
    padding: spacing[4],
    paddingBottom: spacing[8]
  },

  notice: {
    fontSize: fontSize.sm,
    lineHeight: 20,
    fontFamily: fontFamily.sans,
    color: colors.onFeltMuted
  }
});
