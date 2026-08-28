import { StyleSheet } from 'react-native';

import { borderWidth, colors, fontFamily, fontSize, radii } from '@/ui-kit';

import { HAT_SIZE, RING_PADDING } from '../../OpponentSeat.styles';

export const styles = StyleSheet.create({
  identity: {
    alignItems: 'center',
    gap: 2
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
    gap: 1,
    maxWidth: 84
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
