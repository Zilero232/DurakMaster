import { StyleSheet } from 'react-native';

import { borderWidth, colors, fontFamily, fontSize, radii, spacing } from '@/ui-kit';

import { tabStyles } from '../tab-styles';

export const styles = StyleSheet.create({
  ...tabStyles,

  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    paddingHorizontal: spacing[3],
    borderWidth: borderWidth.hairline,
    borderColor: colors.border,
    borderRadius: radii.md,
    backgroundColor: colors.surface2
  },

  searchIcon: {
    marginRight: spacing[2]
  },

  search: {
    flex: 1,
    height: '100%',
    fontSize: fontSize.md,
    fontFamily: fontFamily.sans,
    color: colors.foreground
  }
});
