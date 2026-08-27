import { StyleSheet } from 'react-native';

import { borderWidth, colors, radii, spacing } from '@/ui-kit';

const SIZE = 40;

export const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    top: spacing[3],
    right: spacing[3],
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: SIZE,
    height: SIZE,
    borderWidth: borderWidth.hairline,
    borderColor: colors.glassBorder,
    borderRadius: radii.pill,
    backgroundColor: colors.glassStrong
  },

  pressed: {
    backgroundColor: colors.glass
  }
});
