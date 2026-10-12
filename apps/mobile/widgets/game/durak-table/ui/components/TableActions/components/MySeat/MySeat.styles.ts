import { StyleSheet } from 'react-native';

import { borderWidth, colors, PRIMARY_ACTION_HEIGHT, radii, shadows, spacing } from '@/ui-kit';

const RING_PADDING = spacing[0.5];

export const AVATAR_DIAMETER = PRIMARY_ACTION_HEIGHT - (RING_PADDING + borderWidth.regular) * 2;

export const styles = StyleSheet.create({
  root: {
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    width: PRIMARY_ACTION_HEIGHT
  },

  ring: {
    padding: RING_PADDING,
    borderWidth: borderWidth.regular,
    borderColor: colors.glassBorder,
    borderRadius: radii.pill,
    backgroundColor: colors.surface1,
    ...shadows.card
  }
});
