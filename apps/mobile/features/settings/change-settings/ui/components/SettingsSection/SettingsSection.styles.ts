import { StyleSheet } from 'react-native';

import { colors, fontFamily, fontSize, radii, spacing } from '@/ui-kit';

const BADGE_SIZE = 30;

export const styles = StyleSheet.create({
  root: {
    gap: spacing[3]
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3]
  },

  badge: {
    alignItems: 'center',
    justifyContent: 'center',
    width: BADGE_SIZE,
    height: BADGE_SIZE,
    borderRadius: radii.md,
    backgroundColor: colors.glass
  },

  heading: {
    flex: 1,
    gap: 2
  },

  title: {
    fontSize: fontSize.md,
    fontFamily: fontFamily.sansBold,
    color: colors.foreground
  },

  hint: {
    fontSize: fontSize.xs,
    fontFamily: fontFamily.sans,
    color: colors.mutedForeground
  }
});
