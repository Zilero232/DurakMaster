import type { Card } from '@durak-master/schemas';

import { useEffect } from 'react';
import { Gesture } from 'react-native-gesture-handler';
import { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import type { DropZone } from '../../drop-zone';

const LIFT_SCALE = 1.12;
const SPRING = { damping: 22, stiffness: 320 };

const RETURN_SPRING = { damping: 26, stiffness: 420, overshootClamping: true };

const zoneAt = (zones: DropZone[], x: number, y: number): number | null => {
  'worklet';

  for (const zone of zones) {
    if (x >= zone.x && x <= zone.x + zone.width && y >= zone.y && y <= zone.y + zone.height) {
      return zone.index;
    }
  }

  return null;
};

type UseCardGestureInput = {
  card: Card;

  isPlayable: boolean;
  dropZones: DropZone[];
  onDropOn: (index: number) => void;

  onDropMiss: (travelY: number) => void;
  onPlay: () => void;
  onHover: (index: number | null) => void;
  onDragStart: () => void;
  onDragEnd: () => void;
};

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

    .minDistance(8)
    .onStart(() => {
      isDragging.value = true;
      scale.value = withSpring(LIFT_SCALE, SPRING);
      scheduleOnRN(onDragStart);
    })
    .onUpdate((event) => {
      offsetX.value = event.translationX;
      offsetY.value = event.translationY;

      const zone = isPlayable ? zoneAt(zones.value, event.absoluteX, event.absoluteY) : null;

      if (zone === hoveredZone.value) {
        return;
      }

      hoveredZone.value = zone;
      scheduleOnRN(onHover, zone);
    })
    .onEnd((event) => {
      const index = isPlayable ? zoneAt(zones.value, event.absoluteX, event.absoluteY) : null;

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
