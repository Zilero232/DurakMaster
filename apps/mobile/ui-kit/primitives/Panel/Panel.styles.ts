import type { ViewStyle } from 'react-native';

import { StyleSheet } from 'react-native';

import type { PanelElevation, PanelPadding, PanelTone } from './Panel.types';

import { colors, radii, shadows, spacing, surfaceGradient } from '../../theme';

export const TONE_GRADIENT: Record<PanelTone, readonly [string, string, ...string[]]> = {
  plain: [colors.surface1, colors.surface1],
  raised: surfaceGradient.raised,
  sunken: surfaceGradient.sunken
};

export const ELEVATION_STYLES: Record<PanelElevation, ViewStyle> = {
  flat: {},
  lifted: shadows.card,
  floating: shadows.panel
};

export const PADDING_STYLES: Record<PanelPadding, ViewStyle> = {
  none: { padding: 0 },
  compact: { padding: spacing[3] },
  default: { padding: spacing[4] },
  roomy: { padding: spacing[6] }
};

export const styles = StyleSheet.create({
  root: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    borderRadius: radii.lg,
    overflow: 'hidden'
  },

  highlighted: {
    borderColor: colors.borderGold
  },

  sheen: {
    position: 'absolute',
    zIndex: -1,
    top: 0,
    right: 0,
    left: 0,
    height: 1,
    backgroundColor: colors.glassHighlight
  }
});
