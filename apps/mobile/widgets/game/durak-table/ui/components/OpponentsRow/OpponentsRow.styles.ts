import { StyleSheet } from 'react-native';

import { spacing } from '@/ui-kit';

export const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    justifyContent: 'center',
    gap: spacing[2],
    paddingTop: spacing[3],
    paddingBottom: spacing[2],
    paddingHorizontal: spacing[2]
  }
});
