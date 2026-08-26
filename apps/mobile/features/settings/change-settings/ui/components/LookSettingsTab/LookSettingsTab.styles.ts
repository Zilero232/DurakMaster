import { StyleSheet } from 'react-native';

import { spacing } from '@/ui-kit';

export const styles = StyleSheet.create({
  root: {
    gap: spacing[5]
  },

  themes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[3]
  }
});
