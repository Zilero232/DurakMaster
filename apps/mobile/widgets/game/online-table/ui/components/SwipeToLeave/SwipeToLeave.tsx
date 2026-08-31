import { LogOut } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Text, useWindowDimensions, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { colors, iconSize } from '@/ui-kit';

import type { SwipeToLeaveProps } from './SwipeToLeave.types';

import {
  EDGE_ZONE_RATIO,
  LEAVE_DURATION_MS,
  LEAVE_RATIO,
  LEAVE_VELOCITY,
  MIN_EDGE_ZONE,
  SPRING
} from './SwipeToLeave.config';
import { styles } from './SwipeToLeave.styles';

export const SwipeToLeave = ({ children, onLeave }: SwipeToLeaveProps) => {
  const { t } = useTranslation();

  const { width } = useWindowDimensions();

  const offset = useSharedValue(0);

  const isEdgeSwipe = useSharedValue(false);

  const edgeZone = Math.max(MIN_EDGE_ZONE, width * EDGE_ZONE_RATIO);
  const threshold = width * LEAVE_RATIO;

  const pan = Gesture.Pan()
    .activeOffsetX([-16, 16])
    .failOffsetY([-24, 24])
    .onBegin((event) => {
      isEdgeSwipe.value = event.x <= edgeZone;
      offset.value = 0;
    })
    .onUpdate((event) => {
      if (!isEdgeSwipe.value) {
        return;
      }

      offset.value = Math.max(0, event.translationX);
    })
    .onEnd((event) => {
      if (!isEdgeSwipe.value) {
        return;
      }

      const isFar = offset.value > threshold;
      const isFlick = event.velocityX > LEAVE_VELOCITY;

      if (isFar || isFlick) {
        offset.value = withTiming(width, { duration: LEAVE_DURATION_MS }, (finished) => {
          if (finished) {
            scheduleOnRN(onLeave);
          }
        });

        return;
      }

      offset.value = withSpring(0, SPRING);
    })
    .onFinalize(() => {
      isEdgeSwipe.value = false;
    });

  const slide = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value }]
  }));

  const hint = useAnimatedStyle(() => ({
    opacity: interpolate(offset.value, [0, threshold], [0, 1], 'clamp')
  }));

  return (
    <View style={styles.root}>
      <Animated.View style={[styles.hint, hint]}>
        <LogOut color={colors.onFeltMuted} size={iconSize.xl} />

        <Text style={styles.hintLabel}>{t('table.leave')}</Text>
      </Animated.View>

      <GestureDetector gesture={pan}>
        <Animated.View style={[styles.table, slide]}>{children}</Animated.View>
      </GestureDetector>
    </View>
  );
};
