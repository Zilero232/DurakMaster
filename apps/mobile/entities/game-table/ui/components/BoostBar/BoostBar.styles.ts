import { StyleSheet } from 'react-native';

import { spacing } from '@/ui-kit';

export const styles = StyleSheet.create({
  root: {
    flexGrow: 0,
    flexShrink: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2]
  }
});
