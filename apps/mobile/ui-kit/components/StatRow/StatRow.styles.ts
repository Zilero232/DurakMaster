import { StyleSheet } from 'react-native';

import { colors, fontFamily, fontSize, radii, spacing } from '../../theme';

const TRACK_HEIGHT = 6;

export const styles = StyleSheet.create({
  root: {
    gap: spacing[2]
  },

  row: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: spacing[3]
  },

  label: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.sans,
    color: colors.mutedForeground
  },

  value: {
    fontSize: fontSize.lg,
    fontFamily: fontFamily.displayBold,
    color: colors.foreground
  },

  track: {
    overflow: 'hidden',
    height: TRACK_HEIGHT,
    borderRadius: radii.pill,
    backgroundColor: colors.surface3
  },

  fill: {
    height: '100%',
    borderRadius: radii.pill,
    backgroundColor: colors.success
  }
});
