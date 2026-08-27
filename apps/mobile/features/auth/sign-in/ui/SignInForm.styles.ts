import { StyleSheet } from 'react-native';

import { colors, fontFamily, fontSize, radii, shadows, spacing } from '@/ui-kit';

export const styles = StyleSheet.create({
  wash: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  },

  root: {
    flex: 1,
    backgroundColor: colors.background
  },

  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[6]
  },

  card: {
    gap: spacing[4],
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    padding: spacing[6],
    borderRadius: radii.xl,
    backgroundColor: colors.surfaceOverlay,
    ...shadows.panel
  },

  title: {
    fontSize: fontSize.xxl,
    fontWeight: '800',
    fontFamily: fontFamily.displayBold,
    color: colors.foreground,
    textAlign: 'center'
  },

  subtitle: {
    marginBottom: spacing[2],
    fontSize: fontSize.sm,
    lineHeight: 20,
    color: colors.mutedForeground,
    textAlign: 'center'
  },

  error: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    fontFamily: fontFamily.sansSemi,
    color: colors.accent
  },

  switch: {
    padding: spacing[2],
    fontSize: fontSize.md,
    fontWeight: '600',
    fontFamily: fontFamily.sansSemi,
    color: colors.mutedForeground,
    textAlign: 'center'
  }
});
