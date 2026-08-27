import { StyleSheet } from 'react-native';

import { borderWidth, colors, fontFamily, fontSize, radii, spacing } from '@/ui-kit';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center'
  },

  table: {
    flex: 1,
    justifyContent: 'space-between'
  },

  score: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    gap: spacing[4],
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[4],
    borderRadius: radii.pill,
    borderWidth: borderWidth.hairline,
    borderColor: colors.glassBorder,
    backgroundColor: colors.glass
  },

  label: {
    fontSize: fontSize.xs,
    fontFamily: fontFamily.sans,
    color: colors.onFeltMuted
  },

  value: {
    fontSize: fontSize.lg,
    fontFamily: fontFamily.displayBold,
    color: colors.onFelt
  },

  footer: {
    gap: spacing[3],
    paddingBottom: spacing[4]
  },

  action: {
    alignSelf: 'center',
    minWidth: 200
  }
});
