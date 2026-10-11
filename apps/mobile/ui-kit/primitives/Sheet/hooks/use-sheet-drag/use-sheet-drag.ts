import { useEffect } from 'react';
import { Gesture } from 'react-native-gesture-handler';
import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import type { UseSheetDragInput, UseSheetDragResult } from './use-sheet-drag.types';

import {
  CLOSE_DURATION_MS,
  CLOSE_RATIO,
  CLOSE_VELOCITY,
  OPEN_DURATION_MS,
  SPRING
} from '../../Sheet.config';

export const useSheetDrag = ({
  isOpen,
  maxHeight,
  onClose
}: UseSheetDragInput): UseSheetDragResult => {
  const offset = useSharedValue(maxHeight);

  const slide = useAnimatedStyle(() => ({ transform: [{ translateY: offset.value }] }));

  useEffect(() => {
    offset.value = isOpen
      ? withTiming(0, { duration: OPEN_DURATION_MS, easing: Easing.out(Easing.cubic) })
      : withTiming(maxHeight, {
          duration: CLOSE_DURATION_MS,
          easing: Easing.in(Easing.cubic)
        });
  }, [isOpen, maxHeight, offset]);

  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      offset.value = Math.max(0, event.translationY);
    })
    .onEnd((event) => {
      const isFar = offset.value > maxHeight * CLOSE_RATIO;
      const isFlick = event.velocityY > CLOSE_VELOCITY;

      if (isFar || isFlick) {
        offset.value = withTiming(maxHeight, { duration: CLOSE_DURATION_MS }, () => {
          scheduleOnRN(onClose);
        });

        return;
      }

      offset.value = withSpring(0, SPRING);
    });

  return { gesture, slide };
};
