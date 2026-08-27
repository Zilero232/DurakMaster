import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming
} from 'react-native-reanimated';

import type { SpinnerProps } from './Spinner.types';

import { colors } from '../../theme';
import { createStyles } from './Spinner.styles';

const TURN_MS = 900;

export const Spinner = ({ size = 24, color = colors.accent, style }: SpinnerProps) => {
  const angle = useSharedValue(0);

  useEffect(() => {
    angle.value = withRepeat(
      withTiming(360, { duration: TURN_MS, easing: Easing.linear }),
      -1,
      false
    );
  }, [angle]);

  const spin = useAnimatedStyle(() => ({ transform: [{ rotate: `${angle.value}deg` }] }));

  const styles = createStyles(size, color);

  return (
    <View style={style}>
      <Animated.View style={[styles.ring, spin]} />
    </View>
  );
};
