import { StyleSheet } from 'react-native';

import { colors, fontFamily, fontSize, radii, spacing } from '@/ui-kit';

export const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3]
  },

  tools: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2]
  },

  tool: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[1],
    minWidth: 44,
    height: 44,
    paddingHorizontal: spacing[2],
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: colors.glassBorder,
    borderRadius: radii.md,
    backgroundColor: 'rgba(255, 255, 255, 0.14)'
  },

  toolCount: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    fontFamily: fontFamily.sansBold,
    color: colors.onFelt
  },

  moves: {
    flex: 1,
    flexDirection: 'row',
    gap: spacing[2]
  }
});
