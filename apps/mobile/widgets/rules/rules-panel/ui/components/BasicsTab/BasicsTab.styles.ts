import { StyleSheet } from 'react-native';

import { spacing } from '@/ui-kit';

export const styles = StyleSheet.create({
  root: {
    gap: spacing[3]
  },

  facts: {
    flexDirection: 'row',
    gap: spacing[2],
    marginBottom: spacing[1]
  }
});
