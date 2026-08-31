import { StyleSheet } from 'react-native';

import {
  borderWidth,
  colors,
  fontFamily,
  fontSize,
  lineHeight,
  radii,
  shadows,
  spacing
} from '@/ui-kit';

const SEAT_DOT = 9;
const AVATAR_OVERLAP = -8;

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

  tile: {
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: spacing[3],
    padding: spacing[4]
  },

  tileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing[3]
  },

  tileBet: {
    fontSize: fontSize.xxl,
    fontFamily: fontFamily.displayBold,
    lineHeight: lineHeight.tight(fontSize.xxl),
    color: colors.gold
  },

  tileNames: {
    marginLeft: spacing[3],
    fontSize: fontSize.sm,
    fontFamily: fontFamily.sansSemi,
    color: colors.foreground
  },

  tileFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing[3]
  },

  tileJoin: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[4],
    borderWidth: borderWidth.hairline,
    borderColor: colors.borderGold,
    borderRadius: radii.pill,
    backgroundColor: colors.primary,
    ...shadows.tile
  },

  tileJoinLabel: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.sansBold,
    color: colors.primaryForeground
  },

  premium: {
    borderColor: colors.borderGold
  },

  blocked: {
    opacity: 0.55
  },

  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }]
  },

  betColumn: {
    alignItems: 'flex-start',
    gap: spacing[1],
    minWidth: 76
  },

  bet: {
    fontSize: fontSize.xl,
    fontFamily: fontFamily.displayBold,
    lineHeight: lineHeight.tight(fontSize.xl),

    color: colors.gold
  },

  seats: {
    flexDirection: 'row',
    gap: spacing[1]
  },

  seat: {
    width: SEAT_DOT,
    height: SEAT_DOT,
    borderRadius: radii.pill,
    backgroundColor: colors.surface3
  },

  seatTaken: {
    backgroundColor: colors.success
  },

  main: {
    flex: 1,
    gap: spacing[1],
    minWidth: 0
  },

  players: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1]
  },

  playerAvatar: {
    marginRight: AVATAR_OVERLAP,
    borderWidth: borderWidth.regular,
    borderColor: colors.surface1
  },

  names: {
    flex: 1,
    marginLeft: spacing[3],
    fontSize: fontSize.sm,
    fontFamily: fontFamily.sansSemi,
    color: colors.foreground
  },

  action: {
    alignItems: 'center',
    justifyContent: 'center'
  },

  tileBetGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2]
  },

  ownBadge: {
    flexShrink: 0,
    paddingVertical: 2,
    paddingHorizontal: spacing[2],
    borderRadius: radii.pill,
    fontSize: fontSize.xs,
    fontFamily: fontFamily.sansBold,
    color: colors.goldDeep,
    backgroundColor: colors.gold
  },

  blockedLabel: {
    fontSize: fontSize.xs,
    fontFamily: fontFamily.sansSemi,
    color: colors.subtleForeground,
    textAlign: 'center'
  }
});
