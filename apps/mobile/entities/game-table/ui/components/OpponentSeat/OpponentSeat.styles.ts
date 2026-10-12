import { StyleSheet } from 'react-native';

import { colors, glow, radii, spacing } from '@/ui-kit';

export const RING_PADDING = 2;

export const BACK_STEP_X = 6;

export const SEAT_PADDING_X = spacing[1];

export const BACK_STEP_ANGLE = 3;

export const styles = StyleSheet.create({
  pressed: {
    backgroundColor: colors.glassStrong
  },

  root: {
    alignItems: 'center',
    gap: 0,
    paddingVertical: 2,
    paddingHorizontal: SEAT_PADDING_X,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    backgroundColor: colors.glass
  },

  active: {
    borderColor: colors.borderAccent,
    backgroundColor: colors.glassStrong,
    ...glow.accent
  },

  out: {
    borderColor: colors.border
  },

  empty: {
    justifyContent: 'center',
    paddingVertical: spacing[1],
    borderStyle: 'dashed',
    borderColor: colors.borderStrong
  },

  invitable: {
    borderColor: colors.borderAccent
  }
});
