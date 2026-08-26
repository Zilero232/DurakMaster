import { StyleSheet } from 'react-native';

import { colors, fontFamily, fontSize, radii, shadows, spacing } from '@/ui-kit';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[5],
    backgroundColor: colors.background
  },

  panel: {
    gap: spacing[3],
    width: '100%',
    maxWidth: 420,
    padding: spacing[6],
    borderRadius: radii.xl,
    backgroundColor: colors.surface1,
    ...shadows.panel
  },

  title: {
    fontSize: fontSize.xl,
    fontWeight: '800',
    fontFamily: fontFamily.displayBold,
    color: colors.foreground,
    textAlign: 'center'
  },

  count: {
    fontSize: fontSize.md,
    color: colors.mutedForeground,
    textAlign: 'center'
  },

  list: {
    gap: spacing[1],
    marginVertical: spacing[2]
  },

  player: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing[3],
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[3],
    borderRadius: radii.sm,
    backgroundColor: colors.surface2
  },

  playerName: {
    flex: 1,
    fontSize: fontSize.md,
    fontWeight: '600',
    fontFamily: fontFamily.sansSemi,
    color: colors.foreground
  },

  mark: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    fontFamily: fontFamily.sansBold,
    color: colors.subtleForeground
  },

  markReady: {
    color: colors.success
  },

  actions: {
    gap: spacing[2]
  }
});
