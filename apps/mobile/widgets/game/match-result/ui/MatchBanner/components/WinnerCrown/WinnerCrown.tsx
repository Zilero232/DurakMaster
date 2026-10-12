import { Crown } from 'lucide-react-native';
import { useEffect } from 'react';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming
} from 'react-native-reanimated';

import { colors } from '@/ui-kit';

import type { WinnerCrownProps } from './WinnerCrown.types';

import { GLOW_PULSE_MS, GLOW_SCALE } from './WinnerCrown.config';
import { createStyles } from './WinnerCrown.styles';

export const WinnerCrown = ({ size }: WinnerCrownProps) => {
  const pulse = useSharedValue(0);

  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1, { duration: GLOW_PULSE_MS, easing: Easing.inOut(Easing.quad) }),
      -1,
      true
    );
  }, [pulse]);

  const glowStyle = useAnimatedStyle(() => ({
    opacity: 0.35 + pulse.value * 0.4,
    transform: [{ scale: 1 + pulse.value * (GLOW_SCALE - 1) }]
  }));

  const styles = createStyles(size);

  return (
    <Animated.View style={styles.root}>
      <Animated.View style={[styles.glow, glowStyle]} />

      <Animated.View style={styles.disc}>
        <Crown color={colors.goldDeep} fill={colors.goldBright} size={size * 0.55} />
      </Animated.View>
    </Animated.View>
  );
};
