import { StyleSheet } from 'react-native';

import { borderWidth, colors, fontFamily, radii, seatRowGap, spacing } from '@/ui-kit';

import { RING_PADDING } from '../../OpponentSeat.styles';

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

  name: {
    maxWidth: '100%',
    fontWeight: '600',
    fontFamily: fontFamily.sansSemi,
    color: colors.onFelt,
    textAlign: 'center'
  },

  role: {
    position: 'absolute',
    top: '100%',
    alignSelf: 'center',
    marginTop: seatRowGap,
    paddingHorizontal: spacing[1],
    color: colors.onFeltMuted,
    textAlign: 'center',
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
