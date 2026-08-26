import { StyleSheet } from 'react-native';

import { colors, fontFamily, fontSize, radii, spacing } from '@/ui-kit';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: colors.background
  },

  middle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[3],
    paddingHorizontal: spacing[3]
  },

  bottom: {
    gap: spacing[3],
    paddingTop: spacing[2],
    paddingHorizontal: spacing[3]
  },

  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing[3],
    minHeight: 32
  },

  status: {
    flex: 1,
    fontSize: fontSize.md,
    fontWeight: '600',
    fontFamily: fontFamily.sansSemi,
    color: colors.onFeltMuted
  },

  statusActive: {
    paddingVertical: spacing[1],
    paddingHorizontal: spacing[3],
    borderRadius: radii.pill,
    fontWeight: '800',
    fontFamily: fontFamily.sansBold,
    color: colors.foreground,
    backgroundColor: colors.gold,
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: 'auto',
    alignSelf: 'flex-start'
  }
});
