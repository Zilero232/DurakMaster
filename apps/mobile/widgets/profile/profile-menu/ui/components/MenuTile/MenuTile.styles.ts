import { StyleSheet } from 'react-native';

import { colors, fontFamily, fontSize, radii, shadows, spacing } from '@/ui-kit';

export const styles = StyleSheet.create({
  root: {
    flexGrow: 1,
    flexBasis: '46%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[1],
    minHeight: 76,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[2],
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    borderRadius: radii.md,
    backgroundColor: colors.surface1,
    ...shadows.tile
  },

  pressed: {
    backgroundColor: colors.glass
  },

  locked: {
    opacity: 0.55
  },

  top: {
    alignItems: 'center',
    justifyContent: 'center'
  },

  halo: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 44,
    borderRadius: radii.pill,
    borderWidth: StyleSheet.hairlineWidth
  },

  badge: {
    position: 'absolute',
    top: -spacing[1],
    right: -spacing[2]
  },

  label: {
    fontSize: fontSize.md,
    fontWeight: '700',
    fontFamily: fontFamily.sansBold,
    color: colors.onFelt,
    textAlign: 'center'
  },

  soon: {
    fontSize: 10,
    color: colors.onFeltMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.4
  }
});
