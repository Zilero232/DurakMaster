import { StyleSheet } from 'react-native';

import { borderWidth, colors, radii, shadows, spacing, TAP_TARGET } from '@/ui-kit';

export const styles = StyleSheet.create({
  root: {
    zIndex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    paddingTop: spacing[1],
    paddingHorizontal: spacing[2]
  },

  menu: {
    alignItems: 'center',
    justifyContent: 'center',
    width: TAP_TARGET,
    height: TAP_TARGET,
    borderWidth: borderWidth.hairline,
    borderColor: colors.glassBorder,
    borderRadius: radii.pill,
    backgroundColor: colors.glassStrong,
    ...shadows.tile
  },

  pressed: {
    backgroundColor: colors.glass
  },

  connection: {
    position: 'absolute',
    top: '100%',
    alignSelf: 'center',
    marginTop: spacing[1]
  }
});
