import { StyleSheet } from 'react-native';

import { borderWidth, colors, radii, shadows, spacing } from '@/ui-kit';

const SEAT_SIZE = 60;
const RING_PADDING = 2;

export const AVATAR_DIAMETER = SEAT_SIZE - (RING_PADDING + borderWidth.regular) * 2;
export const RING_DIAMETER = SEAT_SIZE;
export const HAT_SIZE = 30;

export const styles = StyleSheet.create({
  wrap: {
    gap: spacing[2]
  },

  walletRow: {
    alignItems: 'center'
  },

  root: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[3],
    borderRadius: radii.lg,
    backgroundColor: colors.glass
  },

  slot: {
    flex: 1,
    flexBasis: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    minWidth: 0
  },

  slotEnd: {
    justifyContent: 'flex-end'
  },

  action: {
    flex: 1,
    maxWidth: 168,
    minWidth: 0
  },

  seat: {
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: SEAT_SIZE,
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },

  avatarRing: {
    padding: RING_PADDING,
    borderWidth: borderWidth.regular,
    borderColor: colors.glassBorder,
    borderRadius: radii.pill,
    backgroundColor: colors.surface1,
    ...shadows.card
  },

  hat: {
    position: 'absolute',
    top: -HAT_SIZE * 0.66,
    left: -HAT_SIZE * 0.2,
    zIndex: 3,
    transform: [{ rotate: '-16deg' }]
  }
});
