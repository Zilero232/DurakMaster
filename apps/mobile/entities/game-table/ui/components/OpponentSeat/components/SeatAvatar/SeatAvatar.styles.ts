import { StyleSheet } from 'react-native';

import { borderWidth, colors, opacity, radii } from '@/ui-kit';

import { RING_PADDING } from '../../OpponentSeat.styles';

const BADGE_SIZE = 18;

const BADGE_OFFSET = -2;

export const styles = StyleSheet.create({
  ring: {
    padding: RING_PADDING,
    borderWidth: borderWidth.regular,
    borderColor: colors.borderStrong,
    borderRadius: radii.pill,
    backgroundColor: colors.surface1
  },

  emptyRing: {
    borderStyle: 'dashed',
    backgroundColor: colors.glass
  },

  offlineAvatar: {
    opacity: opacity.disabled
  },

  badge: {
    position: 'absolute',
    bottom: BADGE_OFFSET,
    zIndex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    width: BADGE_SIZE,
    height: BADGE_SIZE,
    borderWidth: borderWidth.regular,
    borderColor: colors.feltMid,
    borderRadius: radii.pill
  },

  ready: {
    right: BADGE_OFFSET,
    backgroundColor: colors.success
  },

  offline: {
    left: BADGE_OFFSET,
    backgroundColor: colors.danger
  }
});
