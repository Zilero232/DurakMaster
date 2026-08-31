import { StyleSheet } from 'react-native';

import { borderWidth, colors, radii, shadows, spacing } from '@/ui-kit';

export const AVATAR_SIZE = 48;

const TILE_MIN_WIDTH = 68;

export const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
    flexBasis: TILE_MIN_WIDTH,
    padding: spacing[2],
    borderRadius: radii.md,
    borderWidth: borderWidth.hairline,
    borderColor: colors.border,
    backgroundColor: colors.surface2,
    ...shadows.tile
  },

  selected: {
    borderColor: colors.accent,
    backgroundColor: colors.surface3
  },

  pressed: {
    opacity: 0.7
  },

  check: {
    position: 'absolute',
    right: -4,
    bottom: -4,
    alignItems: 'center',
    justifyContent: 'center',
    width: 20,
    height: 20,
    borderRadius: radii.pill,
    borderWidth: borderWidth.regular,
    borderColor: colors.surface1,
    backgroundColor: colors.accent
  }
});
