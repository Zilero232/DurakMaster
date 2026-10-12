import { StyleSheet } from 'react-native';

import { spacing } from '@/ui-kit';

export const styles = StyleSheet.create({
  root: {
    flex: 1
  },

  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: spacing[2],
    paddingHorizontal: spacing[4]
  },

  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingTop: spacing[4],
    paddingHorizontal: spacing[5]
  }
});
