import { StyleSheet } from 'react-native';

import { borderWidth, colors, radii, shadows, spacing } from '@/ui-kit';

const TOOL_SIZE = 44;
const RING_PADDING = 2;

const ACTION_MAX_WIDTH = 148;

const AVATAR_SIZE = TOOL_SIZE - (RING_PADDING + borderWidth.regular) * 2;

export const AVATAR_DIAMETER = AVATAR_SIZE;
export const RING_DIAMETER = TOOL_SIZE;

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

  actionSlot: {
    flex: 1,
    minWidth: 0,
    alignItems: 'flex-start'
  },

  action: {
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
