import { StyleSheet } from 'react-native';

import { spacing } from '@/ui-kit';

export const styles = StyleSheet.create({
  sections: {
    gap: spacing[6]
  },

  themes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[3]
  }
});
