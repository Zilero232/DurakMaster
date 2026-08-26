import { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { clamp } from 'remeda';

import { useNow } from '@/shared/lib/time';

import type { TurnTimerProps } from './TurnTimer.types';

import { styles } from './TurnTimer.styles';

const WARN_AT_SECONDS = 5;

const TICK_MS = 250;

export const TurnTimer = ({ deadline, totalSeconds }: TurnTimerProps) => {
  const now = useNow(TICK_MS);

  const progress = useSharedValue(1);

  const left = deadline ? Math.max(0, Math.ceil((deadline - now) / 1000)) : 0;

  useEffect(() => {
    progress.value = withTiming(clamp(left / totalSeconds, { max: 1 }), { duration: TICK_MS });
  }, [left, totalSeconds, progress]);

  const fillStyle = useAnimatedStyle(() => ({ width: `${progress.value * 100}%` }));

  if (!deadline || left <= 0) {
    return null;
  }

  const isWarning = left <= WARN_AT_SECONDS;

  return (
    <View style={[styles.root, isWarning && styles.warn]}>
      <Text style={[styles.value, isWarning && styles.warnValue]}>{left}</Text>

      <View style={styles.track}>
        <Animated.View style={[styles.fill, isWarning && styles.warnFill, fillStyle]} />
      </View>
    </View>
  );
};
