import { StyleSheet } from 'react-native';

import { borderWidth, colors, fontFamily, fontSize, radii, spacing } from '@/ui-kit';

const ONLINE_DOT = 10;

export const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    padding: spacing[3],
    borderRadius: radii.md,
    backgroundColor: colors.surface2
  },

  avatarWrap: {
    position: 'relative'
  },

  online: {
    position: 'absolute',
    right: -1,
    bottom: -1,
    width: ONLINE_DOT,
    height: ONLINE_DOT,
    borderWidth: borderWidth.regular,
    borderColor: colors.surface2,
    borderRadius: radii.pill,
    backgroundColor: colors.success
  },

  info: {
    flex: 1,
    gap: spacing[1],
    minWidth: 0
  },

  name: {
    fontSize: fontSize.md,
    fontFamily: fontFamily.sansBold,
    color: colors.foreground
  },

  meta: {
    fontSize: fontSize.xs,
    fontFamily: fontFamily.sans,
    color: colors.mutedForeground
  },

  actions: {
    flexDirection: 'row',
    gap: spacing[2]
  },

  action: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 36,
    height: 36,
    borderRadius: radii.sm,
    backgroundColor: colors.surface3
  },

  accent: {
    backgroundColor: colors.accent
  }
});
