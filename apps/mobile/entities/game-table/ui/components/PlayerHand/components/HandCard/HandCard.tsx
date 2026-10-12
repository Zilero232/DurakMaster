import { View } from 'react-native';
import Animated, { Easing, FadeInUp } from 'react-native-reanimated';

import { MAX_FAN_ANGLE } from '@/ui-kit';

import type { HandCardProps } from './HandCard.types';

import { DEAL_MS, DEAL_STAGGER_MS, MAX_DEAL_STAGGER_STEPS } from '../../../../../config';
import { DraggableCard } from '../DraggableCard';

export const HandCard = ({
  card,
  index,
  offset,
  fanDrop,
  overlap,
  width,
  isLast,
  isPlayable,
  isSelected,
  hasHint,
  isInstant,
  dropZones,
  onDropOn,
  onDropMiss,
  onHover,
  onDragStart,
  onDragEnd,
  onPlay
}: HandCardProps) => {
  const entering = isInstant
    ? undefined
    : FadeInUp.delay(Math.min(index, MAX_DEAL_STAGGER_STEPS) * DEAL_STAGGER_MS)
        .duration(DEAL_MS)
        .easing(Easing.out(Easing.cubic));

  return (
    <Animated.View entering={entering} style={{ zIndex: index, marginRight: isLast ? 0 : overlap }}>
      <View style={{ transform: [{ translateY: Math.abs(offset) * fanDrop }] }}>
        <DraggableCard
          card={card}
          dropZones={dropZones}
          hasHint={hasHint}
          isPlayable={isPlayable}
          isSelected={isSelected}
          rotation={offset * MAX_FAN_ANGLE}
          width={width}
          onDragEnd={onDragEnd}
          onDragStart={onDragStart}
          onDropMiss={onDropMiss}
          onDropOn={onDropOn}
          onHover={onHover}
          onPlay={onPlay}
        />
      </View>
    </Animated.View>
  );
};
