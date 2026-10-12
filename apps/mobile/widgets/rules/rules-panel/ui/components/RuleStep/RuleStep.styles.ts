import { StyleSheet } from 'react-native';

import { colors, fontFamily, fontSize, lineHeight, radii, spacing } from '@/ui-kit';

import { EXAMPLE_CARD_WIDTH } from '../../RulesPanel.config';

const NUMBER_SIZE = 28;

export const styles = StyleSheet.create({
  root: {
    gap: spacing[2]
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3]
  },

  number: {
    alignItems: 'center',
    justifyContent: 'center',
    width: NUMBER_SIZE,
    height: NUMBER_SIZE,
    borderRadius: radii.pill,
    backgroundColor: colors.accent
  },

  numberText: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.sansBold,
    color: colors.primaryForeground
  },

  title: {
    flex: 1,
    fontSize: fontSize.md,
    fontFamily: fontFamily.sansBold,
    color: colors.foreground
  },

  text: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.sans,
    lineHeight: lineHeight.relaxed(fontSize.sm),
    color: colors.mutedForeground
  },

  example: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    marginTop: spacing[1],
    padding: spacing[2],
    borderRadius: radii.sm,
    backgroundColor: colors.backgroundBottom
  },

  cards: {
    flexDirection: 'row',
    paddingRight: spacing[1]
  },

  overlap: {
    marginLeft: -EXAMPLE_CARD_WIDTH * 0.35
  },

  caption: {
    flex: 1,
    fontSize: fontSize.sm,
    fontFamily: fontFamily.sansSemi,
    color: colors.foreground
  }
});
