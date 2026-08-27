import { StyleSheet } from 'react-native';

import { colors, fontFamily, fontSize, spacing } from '@/ui-kit';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
    paddingHorizontal: spacing[2]
  },

  waiting: {
    flexDirection: 'column',
    gap: spacing[1]
  },

  waitingTitle: {
    fontSize: fontSize.xl,
    fontFamily: fontFamily.displayBold,
    color: colors.onFelt,
    textAlign: 'center'
  },

  waitingCount: {
    fontSize: fontSize.md,
    fontFamily: fontFamily.sans,
    color: colors.onFeltMuted
  }
});
