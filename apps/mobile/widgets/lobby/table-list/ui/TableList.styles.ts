import { StyleSheet } from 'react-native';

import { colors, fontFamily, fontSize } from '@/ui-kit';

export const styles = StyleSheet.create({
  root: {
    flex: 1
  },

  emptyAction: {
    fontSize: fontSize.md,
    fontFamily: fontFamily.sansBold,
    color: colors.primaryForeground
  }
});
