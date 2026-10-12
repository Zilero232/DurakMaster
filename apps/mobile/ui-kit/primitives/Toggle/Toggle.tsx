import { useEffect } from 'react';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';

import type { ToggleProps } from './Toggle.types';

import { colors, duration } from '../../theme';
import { THUMB_TRAVEL } from './Toggle.config';
import { styles } from './Toggle.styles';

export const Toggle = ({ isOn }: ToggleProps) => {
  const progress = useSharedValue(isOn ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(isOn ? 1 : 0, { duration: duration.fast });
  }, [isOn, progress]);

  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(progress.value, [0, 1], [colors.surface3, colors.success])
  }));

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.value * THUMB_TRAVEL }]
  }));

  return (
    <Animated.View pointerEvents='none' style={[styles.track, trackStyle]}>
      <Animated.View style={[styles.thumb, thumbStyle]} />
    </Animated.View>
  );
};
