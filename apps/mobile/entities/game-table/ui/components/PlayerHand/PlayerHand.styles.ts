import { StyleSheet } from 'react-native';

import { spacing } from '@/ui-kit';

export const EDGE_PADDING = spacing[3];

export const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingTop: spacing[6],
    paddingHorizontal: EDGE_PADDING
  }
});
