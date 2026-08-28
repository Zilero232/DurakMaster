import { StyleSheet } from 'react-native';

import { spacing } from '@/ui-kit';

export const styles = StyleSheet.create({
  cards: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing[2],
    paddingVertical: spacing[2]
  }
});
