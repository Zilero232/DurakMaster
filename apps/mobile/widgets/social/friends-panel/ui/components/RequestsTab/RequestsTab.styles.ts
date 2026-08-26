import { StyleSheet } from 'react-native';

import { colors, fontFamily, fontSize } from '@/ui-kit';

import { tabStyles } from '../tab-styles';

export const styles = StyleSheet.create({
  ...tabStyles,

  groupTitle: {
    fontSize: fontSize.xs,
    fontFamily: fontFamily.sansBold,
    color: colors.subtleForeground,
    textTransform: 'uppercase',
    letterSpacing: 0.6
  }
});
