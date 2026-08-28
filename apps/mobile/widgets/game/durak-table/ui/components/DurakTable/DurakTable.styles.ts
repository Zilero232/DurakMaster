import { StyleSheet } from 'react-native';

import { spacing } from '@/ui-kit';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center'
  },

  table: {
    flex: 1,
    gap: spacing[2],
    paddingBottom: spacing[2]
  }
});
