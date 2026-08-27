import { StyleSheet } from 'react-native';

import { colors, glow, radii, spacing } from '@/ui-kit';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[3],
    padding: spacing[2]
  },

  play: {
    flexDirection: 'row',
    gap: spacing[1],
    padding: spacing[1],
    borderRadius: radii.md
  },

  best: {
    backgroundColor: colors.glass,
    ...glow.success
  }
});
