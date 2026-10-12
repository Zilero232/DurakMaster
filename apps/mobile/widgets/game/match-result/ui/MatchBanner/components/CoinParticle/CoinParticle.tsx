import { Coins } from 'lucide-react-native';
import { useEffect } from 'react';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming
} from 'react-native-reanimated';

import { colors } from '@/ui-kit';

import type { CoinParticleProps } from './CoinParticle.types';

import { COIN_SIZE, FLIGHT_MS, SPIN_TURNS } from './CoinParticle.config';
import { styles } from './CoinParticle.styles';

export const CoinParticle = ({ angle, distance, delayMs }: CoinParticleProps) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      delayMs,
      withTiming(1, { duration: FLIGHT_MS, easing: Easing.out(Easing.cubic) })
    );
  }, [delayMs, progress]);

  const flightStyle = useAnimatedStyle(() => ({
    opacity: progress.value < 0.7 ? Math.min(1, progress.value * 6) : (1 - progress.value) / 0.3,
    transform: [
      { translateX: Math.cos(angle) * distance * progress.value },
      { translateY: Math.sin(angle) * distance * progress.value },
      { rotate: `${progress.value * 360 * SPIN_TURNS}deg` }
    ]
  }));

  return (
    <Animated.View style={[styles.root, flightStyle]}>
      <Coins color={colors.goldBright} size={COIN_SIZE} />
    </Animated.View>
  );
};
