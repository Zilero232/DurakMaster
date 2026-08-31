import { StyleSheet } from 'react-native';

import { borderWidth, colors, fontFamily, fontSize, lineHeight, radii, seatRowGap } from '@/ui-kit';

import { HAT_SIZE, RING_PADDING } from '../../OpponentSeat.styles';

const INFO_ROW_GAP = 1;

export const styles = StyleSheet.create({
  identity: {
    alignItems: 'center',
    gap: seatRowGap
  },

  avatarRing: {
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

  hat: {
    position: 'absolute',
    top: -HAT_SIZE * 0.68,
    left: -HAT_SIZE * 0.22,
    zIndex: 3,
    transform: [{ rotate: '-16deg' }]
  },

  ready: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    zIndex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    width: 18,
    height: 18,
    borderWidth: borderWidth.regular,
    borderColor: colors.feltMid,
    borderRadius: radii.pill,
    backgroundColor: colors.success
  },

  info: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: INFO_ROW_GAP,
    height: lineHeight.normal(fontSize.xs) * 2 + INFO_ROW_GAP,
    maxWidth: 84
  },

  emptyInfo: {
    height: 'auto'
  },

  name: {
    maxWidth: '100%',
    fontSize: fontSize.xs,
    fontWeight: '600',
    fontFamily: fontFamily.sansSemi,
    color: colors.onFelt,
    textAlign: 'center'
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
  }
});
