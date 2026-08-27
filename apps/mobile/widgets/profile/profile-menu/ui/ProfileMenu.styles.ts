import { StyleSheet } from 'react-native';

import { borderWidth, colors, radii, shadows } from '@/ui-kit';

export const styles = StyleSheet.create({
  grid: {
    overflow: 'hidden',
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderRadius: radii.lg,
    borderWidth: borderWidth.hairline,
    borderColor: colors.border,
    backgroundColor: colors.surface1,
    ...shadows.tile
  }
});
