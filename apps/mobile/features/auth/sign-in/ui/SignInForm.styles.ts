import { StyleSheet } from 'react-native';

import { spacing } from '@/ui-kit';

export const styles = StyleSheet.create({
  root: {
    flex: 1
  },

  corner: {
    position: 'absolute',
    right: spacing[5],
    zIndex: 1
  },

  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing[5]
  }
});
