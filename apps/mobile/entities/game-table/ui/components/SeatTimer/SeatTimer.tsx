import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedProps, useSharedValue, withTiming } from 'react-native-reanimated';
import { Circle, Svg } from 'react-native-svg';
import { clamp } from 'remeda';

import { useNow } from '@/shared/model/time';
import { colors } from '@/ui-kit';

import type { SeatTimerProps } from './SeatTimer.types';

import { STROKE, TICK_MS, WARN_AT_SECONDS } from './SeatTimer.config';
import { styles } from './SeatTimer.styles';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export const SeatTimer = ({ deadline, totalSeconds, size }: SeatTimerProps) => {
  const now = useNow(TICK_MS);

  const progress = useSharedValue(1);

  const left = deadline ? Math.max(0, Math.ceil((deadline - now) / 1000)) : 0;

  useEffect(() => {
    progress.value = withTiming(clamp(left / totalSeconds, { max: 1 }), { duration: TICK_MS });
  }, [left, totalSeconds, progress]);

  const radius = (size - STROKE) / 2;
  const circumference = 2 * Math.PI * radius;

  const ring = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - progress.value)
  }));

  if (!deadline || left <= 0) {
    return null;
  }

  return (
    <View style={styles.root}>
      <Svg height={size} width={size}>
        <AnimatedCircle
          animatedProps={ring}
          cx={size / 2}
          cy={size / 2}
          fill='none'
          r={radius}
          stroke={left <= WARN_AT_SECONDS ? colors.danger : colors.accentBright}
          strokeDasharray={circumference}
          strokeLinecap='round'
          strokeWidth={STROKE}

          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
    </View>
  );
};
