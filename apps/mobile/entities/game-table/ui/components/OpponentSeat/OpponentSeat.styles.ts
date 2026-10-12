import { StyleSheet } from 'react-native';

import { colors, opacity, radii, spacing } from '@/ui-kit';

export const RING_PADDING = spacing[0.5];

export const BACK_STEP_X = 6;

export const SEAT_PADDING_X = spacing[1];

export const BACK_STEP_ANGLE = 3;

export const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    paddingHorizontal: SEAT_PADDING_X,
    borderRadius: radii.md
  },

  pressed: {
    backgroundColor: colors.glass
  },

  out: {
    opacity: opacity.disabled
  }
});
