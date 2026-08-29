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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing[3],
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4]
  },

  title: {
    fontSize: fontSize.xxl,
    fontWeight: '800',
    fontFamily: fontFamily.displayBold,
    color: colors.onFelt,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 'auto'
  },

  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    flexShrink: 0
  },

  status: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    fontFamily: fontFamily.sansSemi,
    color: colors.onFeltMuted,
    flexShrink: 1
  },

  iconButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: ICON_BUTTON_SIZE,
    height: ICON_BUTTON_SIZE,
    borderWidth: borderWidth.hairline,
    borderColor: colors.glassBorder,
    borderRadius: radii.pill,
    backgroundColor: 'rgba(255, 255, 255, 0.14)'
  }
});
