import { StyleSheet } from 'react-native';

import { colors, fontFamily, fontSize, radii, spacing } from '../../theme';

export const BADGE_SIZE = 20;

export const styles = StyleSheet.create({
  root: {
    minWidth: BADGE_SIZE,
    height: BADGE_SIZE,
    paddingHorizontal: spacing[1],
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center'
  },

  gold: {
    backgroundColor: colors.goldBright
  },

  danger: {
    backgroundColor: colors.danger
  },

  count: {
    fontSize: fontSize.xs,
    fontFamily: fontFamily.sansBold,
    fontWeight: '700'
  },

  countOnGold: {
    color: colors.goldDeep
  },

  countOnDanger: {
    color: colors.onFelt
  }
});
