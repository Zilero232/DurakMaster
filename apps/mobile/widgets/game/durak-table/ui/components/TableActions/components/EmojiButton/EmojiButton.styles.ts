import { StyleSheet } from 'react-native';

import { borderWidth, colors, radii, TAP_TARGET } from '@/ui-kit';

export const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    justifyContent: 'center',
    width: TAP_TARGET,
    height: TAP_TARGET,
    borderWidth: borderWidth.hairline,
    borderColor: colors.glassBorder,
    borderRadius: radii.pill,
    backgroundColor: colors.glassStrong
  },

  pressed: {
    backgroundColor: colors.glass
  }
});
