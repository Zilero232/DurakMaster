import { StyleSheet } from 'react-native';

import { colors, fontFamily, fontSize, radii, shadows, spacing } from '@/ui-kit';

const SEAT_DOT = 7;

export const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: colors.transparent,
    borderRadius: radii.lg,
    backgroundColor: colors.surface1,
    ...shadows.card
  },

  premium: {
    borderColor: colors.borderGold
  },

  blocked: {
    opacity: 0.6
  },

  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }]
  },

  betColumn: {
    alignItems: 'flex-start',
    gap: 4,
    minWidth: 76
  },

  bet: {
    fontSize: fontSize.xl,
    fontWeight: '800',
    fontFamily: fontFamily.displayBold,
    lineHeight: 24,
    color: colors.goldDeep
  },

  seats: {
    flexDirection: 'row',
    gap: 3
  },

  seat: {
    width: SEAT_DOT,
    height: SEAT_DOT,
    borderRadius: radii.pill,
    backgroundColor: colors.border
  },

  seatTaken: {
    backgroundColor: colors.accent
  },

  main: {
    flex: 1,
    gap: 5,
    minWidth: 0
  },

  players: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1]
  },

  playerAvatar: {
    marginRight: -8,
    borderWidth: 2,
    borderColor: colors.surface1
  },

  names: {
    flex: 1,
    marginLeft: spacing[3],
    fontSize: fontSize.sm,
    fontWeight: '600',
    fontFamily: fontFamily.sansSemi,
    color: colors.foreground
  },

  action: {
    alignItems: 'center',
    justifyContent: 'center'
  },

  blockedLabel: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    fontFamily: fontFamily.sansSemi,
    color: colors.subtleForeground
  }
});
