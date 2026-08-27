import { StyleSheet } from 'react-native';

import { colors, radii, spacing } from '@/ui-kit';

const TILE = 56;

export const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing[2]
  },

  tile: {
    alignItems: 'center',
    justifyContent: 'center',
    width: TILE,
    height: TILE,
    borderRadius: radii.md,
    backgroundColor: colors.surface2
  },

  emoji: {
    fontSize: 30
  }
});
