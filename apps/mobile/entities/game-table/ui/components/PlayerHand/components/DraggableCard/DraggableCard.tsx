import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

import { PlayingCard } from '@/ui-kit';

import type { DraggableCardProps } from './DraggableCard.types';

import { useCardGesture } from '../../../../../model';
import { createStyles } from './DraggableCard.styles';

export const DraggableCard = ({
  card,
  rotation,
  width,
  isPlayable,
  isDimmed,
  isSelected,
  dropZones,
  onDropOn,
  onDropMiss,
  onPlay,
  onHover,
  onDragStart,
  onDragEnd
}: DraggableCardProps) => {
  const { gesture, style: dragStyle } = useCardGesture({
    card,
    isPlayable,
    dropZones,
    onDropOn,
    onDropMiss,
    onPlay,
    onHover,
    onDragStart,
    onDragEnd
  });

  const styles = createStyles(width);

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.root, dragStyle]}>
        <PlayingCard
          card={card}
          isDimmed={isDimmed}
          isPlayable={isPlayable}
          isSelected={isSelected}
          rotation={rotation}
          width={width}
        />
      </Animated.View>
    </GestureDetector>
  );
};
