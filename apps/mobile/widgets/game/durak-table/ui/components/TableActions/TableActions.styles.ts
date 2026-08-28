import { StyleSheet } from 'react-native';

import { borderWidth, colors, radii, shadows, spacing } from '@/ui-kit';

const TOOL_SIZE = 44;

const SEAT_SIZE = 60;
const RING_PADDING = 2;

const ACTION_MAX_WIDTH = 148;

const AVATAR_SIZE = SEAT_SIZE - (RING_PADDING + borderWidth.regular) * 2;

export const AVATAR_DIAMETER = AVATAR_SIZE;
export const RING_DIAMETER = SEAT_SIZE;

export const HAT_SIZE = 30;

export const styles = StyleSheet.create({
  hat: {
    position: 'absolute',
    top: -HAT_SIZE * 0.66,
    left: -HAT_SIZE * 0.2,
    zIndex: 3,
    transform: [{ rotate: '-16deg' }]
  },

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

  seat: {
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: SEAT_SIZE
  },

  actionSlot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    flex: 1,
    flexBasis: 0,
    minWidth: 0
  },

  action: {
    flexShrink: 1,
    maxWidth: ACTION_MAX_WIDTH,
    minWidth: 0
  },

  identity: {
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

  boosts: {
    flex: 1,
    flexBasis: 0,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: spacing[2]
  },

  leave: {
    alignItems: 'center',
    justifyContent: 'center',
    width: TOOL_SIZE,
    height: TOOL_SIZE,
    borderWidth: borderWidth.hairline,
    borderColor: colors.glassBorder,
    borderRadius: radii.md,
    backgroundColor: colors.glassStrong
  }
});
