import { StyleSheet } from 'react-native';

import { borderWidth, colors, fontFamily, lineHeight, radii, seatRowGap, spacing } from '@/ui-kit';

import { RING_PADDING } from '../../OpponentSeat.styles';

export const roleRow = (label: number): number => lineHeight.tight(label) + seatRowGap;

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
    fontFamily: fontFamily.sansSemi,
    color: colors.onFelt,
    textAlign: 'center'
  },

  role: {
    position: 'absolute',
    top: '100%',
    alignSelf: 'center',
    marginTop: seatRowGap,
    maxWidth: '100%',
    paddingHorizontal: spacing[1],
    color: colors.onFeltMuted,
    textAlign: 'center'
  },

  defender: {
    fontFamily: fontFamily.sansBold,
    color: colors.goldBright
  },

  offline: {
    color: colors.accentBright
  }
});
