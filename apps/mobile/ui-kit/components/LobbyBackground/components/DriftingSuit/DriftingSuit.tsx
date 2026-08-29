import { useEffect } from 'react';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming
} from 'react-native-reanimated';

import type { DriftingSuitProps } from './DriftingSuit.types';

import { SuitIcon } from '../../../../icons';
import { colors } from '../../../../theme';
import { DRIFT_DISTANCE, DRIFT_MS, DRIFT_SWAY, TILT_DEGREES } from './DriftingSuit.config';
import { styles } from './DriftingSuit.styles';

export const DriftingSuit = ({ mark, top, left, isStatic }: DriftingSuitProps) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    if (isStatic) {
      cancelAnimation(progress);
      progress.value = withTiming(0, { duration: DRIFT_MS / 4 });

      return;
    }

    const duration = DRIFT_MS * mark.speed;

    progress.value = withDelay(
      mark.delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration, easing: Easing.inOut(Easing.sin) }),
          withTiming(0, { duration, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        false
      )
    );
  }, [isStatic, mark.delay, mark.speed, progress]);

  const drift = useAnimatedStyle(() => {
    const eased = progress.value * mark.direction;

    return {
      transform: [
        { translateY: eased * DRIFT_DISTANCE },
        { translateX: eased * DRIFT_SWAY },
        { rotate: `${mark.rotate + eased * TILT_DEGREES}deg` }
      ]
    };
  });

  return (
    <Animated.View style={[styles.mark, { top, left, opacity: mark.opacity }, drift]}>
      <SuitIcon color={colors.foreground} size={mark.size} suit={mark.suit} />
    </Animated.View>
  );
};
