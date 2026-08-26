import { StyleSheet } from 'react-native';

import { colors, fontFamily, fontSize, radii, spacing } from '@/ui-kit';

export const styles = StyleSheet.create({
  root: {
    gap: spacing[5]
  },

  phrases: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2]
  },

  phrase: {
    justifyContent: 'center',
    minHeight: 40,
    paddingHorizontal: spacing[3],
    borderRadius: radii.pill,
    backgroundColor: colors.surface2
  },

  phraseLabel: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.sansSemi,
    color: colors.foreground
  }
});
