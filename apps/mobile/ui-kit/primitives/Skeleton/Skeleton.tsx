import { useEffect } from 'react';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming
} from 'react-native-reanimated';

import type { SkeletonProps } from './Skeleton.types';

import { radii } from '../../theme';
import { PULSE_FROM_OPACITY, PULSE_MS, PULSE_TO_OPACITY } from './Skeleton.config';
import { styles } from './Skeleton.styles';

export const Skeleton = ({
  width = '100%',
  height = 16,
  radius = radii.sm,
  style
}: SkeletonProps) => {
  const opacity = useSharedValue(PULSE_FROM_OPACITY);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(PULSE_TO_OPACITY, { duration: PULSE_MS, easing: Easing.inOut(Easing.quad) }),
      -1,
      true
    );
  }, [opacity]);

  const pulse = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View style={[styles.block, { width, height, borderRadius: radius }, pulse, style]} />
  );
};
