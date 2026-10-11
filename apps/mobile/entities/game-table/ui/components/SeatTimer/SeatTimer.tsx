import { View } from 'react-native';
import Animated from 'react-native-reanimated';
import { Circle, Svg } from 'react-native-svg';

import { colors } from '@/ui-kit';

import type { SeatTimerProps } from './SeatTimer.types';

import { useCountdownRing } from '../../../model';
import { styles } from './SeatTimer.styles';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export const SeatTimer = ({ deadline, totalSeconds, size }: SeatTimerProps) => {
  const { left, radius, circumference, strokeWidth, isUrgent, ring } = useCountdownRing({
    deadline,
    totalSeconds,
    size
  });

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
          stroke={isUrgent ? colors.danger : colors.accentBright}
          strokeDasharray={circumference}
          strokeLinecap='round'
          strokeWidth={strokeWidth}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
    </View>
  );
};
