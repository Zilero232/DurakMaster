import { StyleSheet } from 'react-native';

import { colors, fontSize, radii, spacing } from '@/ui-kit';

export const styles = StyleSheet.create({
  trigger: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 38,
    height: 38,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    borderRadius: radii.sm,
    backgroundColor: colors.surface1
  },

  triggerOpen: {
    borderColor: colors.borderGold
  },

  list: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2]
  },

  phrase: {
    flexGrow: 1,
    flexBasis: '45%',
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[3],
    borderRadius: radii.sm,
    backgroundColor: colors.surface2
  },

  phrasePressed: {
    backgroundColor: colors.surface3
  },

  phraseLabel: {
    fontSize: fontSize.md,
    color: colors.foreground
  }
});
