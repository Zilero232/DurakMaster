import { StyleSheet } from 'react-native';

import { colors, fontFamily, fontSize, ICON_BUTTON_SIZE, radii } from '@/ui-kit';

export const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    justifyContent: 'center',
    width: ICON_BUTTON_SIZE,
    height: ICON_BUTTON_SIZE,
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: colors.glassBorder,
    borderRadius: radii.pill,
    backgroundColor: colors.glass
  },

  squared: {
    borderRadius: radii.md
  },

  code: {
    fontSize: fontSize.xs,
    fontFamily: fontFamily.sansBold,
    color: colors.onFelt
  }
});
