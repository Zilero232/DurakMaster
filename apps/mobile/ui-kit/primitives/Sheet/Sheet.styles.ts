import { StyleSheet } from 'react-native';

import { colors, fontFamily, fontSize, radii, shadows, spacing } from '../../theme';

export const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.scrim
  },

  sheet: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    left: 0,
    maxHeight: '86%',
    paddingTop: spacing[2],
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    backgroundColor: colors.surface1,
    ...shadows.panel
  },

  grabber: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    marginBottom: spacing[2],
    borderRadius: radii.pill,
    backgroundColor: colors.borderStrong
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing[3],
    paddingHorizontal: spacing[5],
    paddingBottom: spacing[3]
  },

  title: {
    flex: 1,
    fontSize: fontSize.xl,
    fontWeight: '800',
    fontFamily: fontFamily.displayBold,
    color: colors.foreground
  },

  close: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
    borderRadius: radii.pill,
    backgroundColor: colors.surface2
  },

  scroll: {
    flexGrow: 0
  },

  content: {
    gap: spacing[3],
    paddingHorizontal: spacing[5],
    paddingBottom: spacing[4]
  },

  footer: {
    gap: spacing[2],
    paddingTop: spacing[3],
    paddingHorizontal: spacing[5],
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border
  }
});
