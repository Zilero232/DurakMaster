import { StyleSheet } from 'react-native';

import { spacing } from '@/ui-kit';

export const styles = StyleSheet.create({
  root: {
    flex: 1
  },

  pill: {
    alignSelf: 'center',
    marginTop: spacing[2]
  },

  content: {
    flex: 1,
    minWidth: 0
  }
});
