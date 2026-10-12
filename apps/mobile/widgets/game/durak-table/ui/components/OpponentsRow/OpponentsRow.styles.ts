import { StyleSheet } from 'react-native';

import { spacing } from '@/ui-kit';

export const styles = StyleSheet.create({
  root: {
    minWidth: 0,
    paddingTop: spacing[2],
    paddingBottom: spacing[2],
    paddingHorizontal: spacing[2]
  },

  seats: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-around',
    minWidth: 0,
    gap: spacing[1]
  }
});
