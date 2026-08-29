import { StyleSheet } from 'react-native';

import { colors, spacing, TOAST_MAX_WIDTH } from '@/ui-kit';

export const rootLayoutStyles = StyleSheet.create({
  screen: {
    backgroundColor: colors.background
  },

  toast: {
    alignSelf: 'center',
    marginHorizontal: spacing[4],
    maxWidth: TOAST_MAX_WIDTH
  },

  toastDesktop: {
    alignSelf: 'flex-end',
    marginHorizontal: spacing[6],
    maxWidth: TOAST_MAX_WIDTH
  }
});
