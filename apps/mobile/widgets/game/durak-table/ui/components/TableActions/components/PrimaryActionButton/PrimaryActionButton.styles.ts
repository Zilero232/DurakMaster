import { StyleSheet } from 'react-native';

import { colors, fontFamily, fontSize, PRIMARY_ACTION_HEIGHT } from '@/ui-kit';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    minWidth: 0,
    minHeight: PRIMARY_ACTION_HEIGHT
  },

  status: {
    justifyContent: 'center'
  },

  statusText: {
    fontSize: fontSize.md,
    fontFamily: fontFamily.sansSemi,
    color: colors.onFeltMuted,
    textAlign: 'center'
  }
});
