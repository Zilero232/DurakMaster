import { StyleSheet } from 'react-native';

import {
  colors,
  fontFamily,
  fontSize,
  iconSize,
  radii,
  shadows,
  spacing,
  TAP_TARGET
} from '../../theme';

export const styles = StyleSheet.create({
  root: {
    flex: 1
  },

  backdrop: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: colors.scrim
  },

  backdropFill: {
    flex: 1
  },

  keyboardFrame: {
    flex: 1,
    justifyContent: 'flex-end',
    pointerEvents: 'box-none'
  },

  panel: {
    backgroundColor: colors.surface1,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderStrong,
    overflow: 'hidden',
    ...shadows.panel
  },

  fill: {
    position: 'absolute',
    zIndex: -1,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  },

  sheet: {
    paddingTop: spacing[2],
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl
  },

  grabberZone: {
    alignItems: 'center',
    paddingTop: spacing[1],
    paddingBottom: spacing[2]
  },

  grabber: {
    width: 40,
    height: 4,
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
    width: TAP_TARGET,
    height: TAP_TARGET,
    marginRight: -spacing[2]
  },

  closeFrame: {
    alignItems: 'center',
    justifyContent: 'center',
    width: iconSize.xl,
    height: iconSize.xl,
    borderRadius: radii.pill,
    backgroundColor: colors.surface2
  },

  scroll: {
    flexGrow: 0,
    flexShrink: 1
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
