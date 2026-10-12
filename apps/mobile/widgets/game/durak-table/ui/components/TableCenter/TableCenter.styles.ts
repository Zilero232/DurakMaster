import { StyleSheet } from 'react-native';

import { opacity, spacing } from '@/ui-kit';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: spacing[3]
  },

  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },

  discard: {
    alignItems: 'flex-end',
    opacity: opacity.muted
  }
});
