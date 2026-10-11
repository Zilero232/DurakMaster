import { StyleSheet } from 'react-native';

import { colors, spacing } from '@/ui-kit';

export const rootLayoutStyles = StyleSheet.create({
  screen: {
    backgroundColor: colors.background
  },

  toast: {
    alignSelf: 'center',
    marginHorizontal: spacing[4]
  }
});
