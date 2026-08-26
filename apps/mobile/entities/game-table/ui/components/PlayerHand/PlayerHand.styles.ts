import { StyleSheet } from 'react-native';

import { card as cardTokens, spacing } from '@/ui-kit';

export const EDGE_PADDING = spacing[3];

export const fanOverlap = (count: number, width: number, available: number): number => {
  if (count < 2) {
    return 0;
  }

  const loose = width * cardTokens.overlap;
  const needed = width + (count - 1) * (width + loose);

  if (needed <= available) {
    return loose;
  }

  return (available - width) / (count - 1) - width;
};

export const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingTop: spacing[6],
    paddingHorizontal: EDGE_PADDING
  }
});
