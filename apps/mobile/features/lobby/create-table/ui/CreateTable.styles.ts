import { StyleSheet } from 'react-native';

import { spacing } from '@/ui-kit';

export const styles = StyleSheet.create({
  root: {
    gap: spacing[5],
    paddingBottom: spacing[6]
  },

  row: {
    flexDirection: 'row',
    gap: spacing[4]
  }
});
