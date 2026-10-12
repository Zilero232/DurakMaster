import { StyleSheet } from 'react-native';

import {
  borderWidth,
  colors,
  fontFamily,
  fontSize,
  opacity,
  radii,
  shadows,
  spacing
} from '@/ui-kit';

export const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    borderWidth: borderWidth.hairline,
    borderColor: colors.border,
    borderRadius: radii.lg,
    backgroundColor: colors.surface1,
    overflow: 'hidden',
    ...shadows.card
  },

  fill: {
    position: 'absolute',
    zIndex: -1,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  },

  premium: {
    borderColor: colors.borderGold
  },

  blocked: {
    opacity: opacity.disabled
  },

  pressed: {
    opacity: opacity.muted,
    transform: [{ scale: 0.99 }]
  },

  main: {
    flex: 1,
    gap: spacing[2],
    minWidth: 0
  },

  ownBadge: {
    alignSelf: 'flex-start',
    paddingVertical: spacing[0.5],
    paddingHorizontal: spacing[2],
    borderRadius: radii.pill,
    fontSize: fontSize.xs,
    fontFamily: fontFamily.sansBold,
    color: colors.goldDeep,
    backgroundColor: colors.gold
  },

  action: {
    alignItems: 'center',
    justifyContent: 'center'
  },

  blockedLabel: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.sansSemi,
    color: colors.mutedForeground,
    textAlign: 'center'
  }
});
