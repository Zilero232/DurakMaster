import { StyleSheet } from 'react-native';

import {
  borderWidth,
  colors,
  opacity,
  PRIMARY_ACTION_HEIGHT,
  radii,
  shadows,
  spacing
} from '@/ui-kit';

const RING_PADDING = spacing[0.5];

const BADGE_SIZE = spacing[5];

export const AVATAR_DIAMETER = PRIMARY_ACTION_HEIGHT - (RING_PADDING + borderWidth.regular) * 2;

export const styles = StyleSheet.create({
  root: {
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    width: PRIMARY_ACTION_HEIGHT
  },

  pressed: {
    opacity: opacity.muted
  },

  ring: {
    padding: RING_PADDING,
    borderWidth: borderWidth.regular,
    borderColor: colors.glassBorder,
    borderRadius: radii.pill,
    backgroundColor: colors.surface1,
    ...shadows.card
  },

  badge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    width: BADGE_SIZE,
    height: BADGE_SIZE,
    borderWidth: borderWidth.hairline,
    borderColor: colors.glassBorder,
    borderRadius: radii.pill,
    backgroundColor: colors.surface2
  }
});
