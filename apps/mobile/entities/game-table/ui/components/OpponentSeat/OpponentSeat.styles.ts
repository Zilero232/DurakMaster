import { StyleSheet } from 'react-native';

import {
  borderWidth,
  cardSize,
  colors,
  fontFamily,
  fontSize,
  radii,
  shadows,
  spacing
} from '@/ui-kit';

export const BACK_SCALE = 0.55;

export const backSize = {
  width: cardSize.width * BACK_SCALE,
  height: cardSize.height * BACK_SCALE
};

export const AVATAR_SIZE = 34;

export const HAT_SIZE = 26;
const RING_PADDING = 2;
export const RING_SIZE = AVATAR_SIZE + (RING_PADDING + borderWidth.hairline) * 2;

export const BACK_STEP_X = 11;
export const BACK_STEP_ANGLE = 3;

export const styles = StyleSheet.create({
  hat: {
    position: 'absolute',
    top: -HAT_SIZE * 0.68,
    left: -HAT_SIZE * 0.22,
    zIndex: 3,
    transform: [{ rotate: '-16deg' }]
  },

  root: {
    alignItems: 'center',
    gap: spacing[1],
    minWidth: 96,
    padding: spacing[2],
    borderWidth: 1,
    borderColor: colors.transparent,
    borderRadius: radii.md
  },

  active: {
    borderColor: colors.glassBorder,
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    boxShadow: '0px 0px 10px rgba(225, 175, 59, 0.8)',
    elevation: 8
  },

  out: {
    opacity: 0.45
  },

  cards: {
    width: backSize.width + BACK_STEP_X * 5,
    height: backSize.height
  },

  avatarRing: {
    padding: RING_PADDING,
    borderWidth: borderWidth.hairline,
    borderColor: colors.glassBorder,
    borderRadius: radii.pill,
    backgroundColor: colors.surface1
  },

  back: {
    position: 'absolute',
    top: 0,
    left: 0
  },

  count: {
    position: 'absolute',
    right: 0,
    bottom: -2,
    minWidth: 22,
    paddingVertical: 2,
    paddingHorizontal: spacing[1],
    borderWidth: 2,
    borderColor: colors.surface1,
    borderRadius: radii.pill,
    fontSize: fontSize.xs,
    fontWeight: '700',
    fontFamily: fontFamily.sansBold,
    color: colors.surface1,
    textAlign: 'center',
    backgroundColor: colors.accent,
    overflow: 'hidden'
  },

  identity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2]
  },

  info: {
    alignItems: 'center',
    gap: 2,
    maxWidth: 100
  },

  name: {
    maxWidth: '100%',
    fontSize: fontSize.sm,
    fontWeight: '600',
    fontFamily: fontFamily.sansSemi,
    color: colors.onFelt
  },

  role: {
    fontSize: fontSize.xs,
    color: colors.onFeltMuted,
    textTransform: 'uppercase'
  },

  defender: {
    fontWeight: '700',
    fontFamily: fontFamily.sansBold,
    color: colors.goldBright
  },

  offline: {
    color: colors.accentBright
  },

  phrase: {
    position: 'absolute',
    zIndex: 5,
    top: -14,
    right: -4,
    maxWidth: 180,
    paddingVertical: spacing[1],
    paddingHorizontal: spacing[3],
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.glassBorder,
    borderRadius: radii.pill,
    fontSize: fontSize.sm,
    color: colors.foreground,
    backgroundColor: colors.surfaceOverlay,
    overflow: 'hidden',
    ...shadows.card
  }
});
