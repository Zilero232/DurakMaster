import { StyleSheet } from 'react-native';

import { borderWidth, colors, radii, spacing } from '@/ui-kit';

const TILE_SIZE = 60;

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
    width: TILE_SIZE,
    height: TILE_SIZE,
    borderRadius: radii.md,
    borderWidth: borderWidth.hairline,
    borderColor: colors.border,
    backgroundColor: colors.surface2
  },

  pressed: {
    borderColor: colors.accent,
    backgroundColor: colors.surface3
  }
});
