import { StyleSheet } from 'react-native';

import { colors, fontFamily, lineHeight, seatRowGap, spacing } from '@/ui-kit';

export const roleRow = (label: number): number => lineHeight.tight(label) + seatRowGap;

export const styles = StyleSheet.create({
  identity: {
    alignItems: 'center',
    gap: seatRowGap
  },

  name: {
    maxWidth: '100%',
    fontFamily: fontFamily.sansSemi,
    color: colors.onFelt,
    textAlign: 'center'
  },

  invite: {
    fontFamily: fontFamily.sansBold,
    color: colors.accentBright
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
    fontFamily: fontFamily.sansBold,
    color: colors.danger
  }
});
