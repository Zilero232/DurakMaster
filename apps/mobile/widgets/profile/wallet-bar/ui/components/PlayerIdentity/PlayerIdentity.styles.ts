import { StyleSheet } from 'react-native';

import { colors, fontFamily, fontSize, radii, spacing } from '@/ui-kit';

export const styles = StyleSheet.create({
  root: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3]
  },

  avatarWrap: {
    position: 'relative'
  },

  level: {
    position: 'absolute',
    top: -3,
    right: -3,
    minWidth: 22,
    paddingVertical: 1,
    paddingHorizontal: 5,
    borderWidth: 2,
    borderColor: colors.surface1,
    borderRadius: radii.pill,
    fontSize: fontSize.xs,
    fontWeight: '700',
    fontFamily: fontFamily.sansBold,
    color: colors.surface1,
    textAlign: 'center',
    backgroundColor: colors.foreground
  },

  info: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 'auto',
    gap: 1
  },

  name: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    fontFamily: fontFamily.sansBold,
    color: colors.foreground
  },

  league: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    fontFamily: fontFamily.sansSemi
  },

  premium: {
    marginLeft: spacing[1]
  }
});
