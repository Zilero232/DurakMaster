import { StyleSheet } from 'react-native';

import { spacing } from '@/ui-kit';

export const TABLE_BOTTOM_GAP = spacing[2];

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center'
  },

  table: {
    flex: 1,
    gap: spacing[2]
  }
});
