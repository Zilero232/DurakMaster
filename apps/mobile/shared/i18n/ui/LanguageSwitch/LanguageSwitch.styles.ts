import { StyleSheet } from 'react-native';

import {
  borderWidth,
  colors,
  fontFamily,
  fontSize,
  ICON_BUTTON_SIZE,
  radii,
  spacing
} from '@/ui-kit';

export const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    justifyContent: 'center',
    width: ICON_BUTTON_SIZE,
    height: ICON_BUTTON_SIZE,
    borderWidth: borderWidth.hairline,
    borderColor: colors.glassBorder,
    borderRadius: radii.pill,
    backgroundColor: colors.glass
  },

  squared: {
    height: 'auto',
    minHeight: ICON_BUTTON_SIZE,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[3],
    borderRadius: radii.md
  },

  code: {
    fontSize: fontSize.xs,
    fontFamily: fontFamily.sansBold,
    color: colors.onFelt
  }
});
