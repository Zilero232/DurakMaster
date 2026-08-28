import { StyleSheet } from 'react-native';

import { colors, fontFamily, fontSize, spacing } from '@/ui-kit';

export const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[4]
  },

  label: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.sansSemi,
    color: colors.subtleForeground
  }
});
