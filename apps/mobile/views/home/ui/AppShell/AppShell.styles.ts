import { StyleSheet } from 'react-native';

import { colors } from '@/ui-kit';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.background
  },

  wash: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  },

  column: {
    flex: 1
  },

  content: {
    flex: 1
  }
});
