import { StyleSheet } from 'react-native';

import { borderWidth, colors, fontFamily, fontSize, radii, spacing } from '@/ui-kit';

const BADGE_SIZE = 26;

export const styles = StyleSheet.create({
  root: {
    flexShrink: 0,
    alignItems: 'center',
    gap: spacing[2]
  },

  emptyRoot: {
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },

  emptyBadge: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderWidth: borderWidth.regular,
    borderColor: colors.glassBorder,
    borderRadius: radii.pill,
    backgroundColor: colors.glass
  },

  trumpCard: {
    position: 'absolute',
    zIndex: 0
  },

  back: {
    position: 'absolute',
    zIndex: 1,
    top: 0,
    left: 0
  },

  suit: {
    position: 'absolute',
    zIndex: 2,
    top: -spacing[2],
    left: -spacing[2],
    alignItems: 'center',
    justifyContent: 'center',
    width: BADGE_SIZE,
    height: BADGE_SIZE,
    borderWidth: borderWidth.regular,
    borderColor: colors.feltDeep,
    borderRadius: radii.pill,
    backgroundColor: colors.onFelt
  },

  count: {
    position: 'absolute',
    zIndex: 2,
    bottom: -spacing[2],
    left: -spacing[1],
    overflow: 'hidden',
    minWidth: BADGE_SIZE,
    height: BADGE_SIZE,
    paddingHorizontal: spacing[1],
    borderWidth: borderWidth.hairline,
    borderColor: colors.glassBorder,
    borderRadius: radii.pill,
    fontSize: fontSize.sm,
    fontFamily: fontFamily.displayBold,
    lineHeight: BADGE_SIZE,
    color: colors.onFelt,
    textAlign: 'center',
    backgroundColor: colors.backgroundDeep
  }
});
