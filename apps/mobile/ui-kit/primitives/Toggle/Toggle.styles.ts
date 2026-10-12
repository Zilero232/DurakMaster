import { StyleSheet } from 'react-native';

import { colors, radii, shadows } from '../../theme';
import { THUMB_INSET, THUMB_SIZE, TRACK_HEIGHT, TRACK_WIDTH } from './Toggle.config';

export const styles = StyleSheet.create({
  track: {
    justifyContent: 'center',
    width: TRACK_WIDTH,
    height: TRACK_HEIGHT,
    paddingHorizontal: THUMB_INSET,
    borderRadius: radii.pill,
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: colors.borderStrong
  },

  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: radii.pill,
    backgroundColor: colors.foreground,
    ...shadows.tile
  }
});
