import { useEffect } from 'react';
import { Gesture } from 'react-native-gesture-handler';
import { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import type { DropZone } from '../../drop-zone';
import type { UseCardGestureInput } from './use-card-gesture.types';

import { zoneAt } from '../../../lib';
import { DRAG_MIN_DISTANCE, LIFT_SCALE, RETURN_SPRING, SPRING } from './use-card-gesture.config';

export const useCardGesture = ({
  isPlayable,
  dropZones,
  onDropOn,
  onDropMiss,
  onPlay,
  onHover,
  onDragStart,
  onDragEnd
}: UseCardGestureInput) => {
  const zones = useSharedValue<DropZone[]>(dropZones);

  useEffect(() => {
    zones.value = dropZones;
  }, [dropZones, zones]);

  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);
  const scale = useSharedValue(1);
  const isDragging = useSharedValue(false);
  const hoveredZone = useSharedValue<number | null>(null);

  const settle = () => {
    'worklet';

    if (!isDragging.value) {
      return;
    }

    offsetX.value = withSpring(0, RETURN_SPRING);
    offsetY.value = withSpring(0, RETURN_SPRING);
    scale.value = withSpring(1, RETURN_SPRING);
    isDragging.value = false;
    hoveredZone.value = null;
  };

  const pan = Gesture.Pan()

    .minDistance(DRAG_MIN_DISTANCE)
    .onStart(() => {
      isDragging.value = true;
      scale.value = withSpring(LIFT_SCALE, SPRING);
      scheduleOnRN(onDragStart);
    })
    .onUpdate((event) => {
      offsetX.value = event.translationX;
      offsetY.value = event.translationY;

      const zone = isPlayable
        ? zoneAt({ zones: zones.value, x: event.absoluteX, y: event.absoluteY })
        : null;

      if (zone === hoveredZone.value) {
        return;
      }

      hoveredZone.value = zone;
      scheduleOnRN(onHover, zone);
    })
    .onEnd((event) => {
      const index = isPlayable
        ? zoneAt({ zones: zones.value, x: event.absoluteX, y: event.absoluteY })
        : null;

      settle();

      if (!isPlayable) {
        return;
      }

      if (index === null) {
        scheduleOnRN(onDropMiss, -event.translationY);

        return;
      }

      scheduleOnRN(onDropOn, index);
    })
    .onFinalize(() => {
      settle();
      scheduleOnRN(onDragEnd);
    });

  const tap = Gesture.Tap().onEnd(() => {
    if (!isPlayable) {
      return;
    }

    scheduleOnRN(onPlay);
  });

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: offsetX.value },
      { translateY: offsetY.value },
      { scale: scale.value }
    ]
  }));

  return { gesture: Gesture.Exclusive(pan, tap), style };
};
