import { StyleSheet } from 'react-native';

import { opacity, spacing } from '@/ui-kit';

const EDGE_PADDING = spacing[4];

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
    paddingHorizontal: EDGE_PADDING
  },

  discard: {
    position: 'absolute',
    right: EDGE_PADDING,
    zIndex: 1,
    opacity: opacity.muted
  }
});
