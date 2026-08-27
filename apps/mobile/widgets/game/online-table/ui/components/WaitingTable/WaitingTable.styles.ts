import { StyleSheet } from 'react-native';

import { colors, fontFamily, fontSize, spacing } from '@/ui-kit';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center'
  },

  table: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[4]
  },

  title: {
    fontSize: fontSize.xl,
    fontFamily: fontFamily.displayBold,
    color: colors.onFelt
  },

  hint: {
    fontSize: fontSize.md,
    fontFamily: fontFamily.sans,
    color: colors.onFeltMuted
  },

  actions: {
    gap: spacing[2],
    width: '100%',
    maxWidth: 320
  }
});
