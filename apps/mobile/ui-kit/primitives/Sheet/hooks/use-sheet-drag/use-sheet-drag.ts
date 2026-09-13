import { useEffect } from 'react';
import { Gesture } from 'react-native-gesture-handler';
import { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import type { UseSheetDragInput } from './use-sheet-drag.types';

import { CLOSE_DURATION_MS, CLOSE_RATIO, CLOSE_VELOCITY, SPRING } from '../../Sheet.config';

export const useSheetDrag = ({ isOpen, maxHeight, onClose }: UseSheetDragInput) => {
  const offset = useSharedValue(0);

  const slide = useAnimatedStyle(() => ({ transform: [{ translateY: offset.value }] }));

  useEffect(() => {
    if (isOpen) {
      offset.value = 0;
    }
  }, [isOpen, offset]);

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
