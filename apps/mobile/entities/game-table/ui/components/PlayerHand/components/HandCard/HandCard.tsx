import { View } from 'react-native';
import Animated from 'react-native-reanimated';

import { MAX_FAN_ANGLE, useEnterMotion } from '@/ui-kit';

import type { HandCardProps } from './HandCard.types';

import { DEAL_MS, DEAL_OFFSET } from '../../../../../config';
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
  const motion = useEnterMotion({ offsetY: -DEAL_OFFSET, durationMs: DEAL_MS, isInstant });

  return (
    <Animated.View style={[{ zIndex: index, marginRight: isLast ? 0 : overlap }, motion]}>
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
