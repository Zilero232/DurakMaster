import { View } from 'react-native';
import Animated, { FadeOut, LinearTransition, SlideInRight } from 'react-native-reanimated';

import { cardKey } from '@/shared/lib/cards';
import { MAX_FAN_ANGLE } from '@/ui-kit';

import type { PlayerHandProps } from './PlayerHand.types';

import { sortHand } from '../../../lib';
import { useCardSize } from '../../../model';
import { DraggableCard } from './components';
import { EDGE_PADDING, fanOverlap, styles } from './PlayerHand.styles';

const FAN_DROP_RATIO = 0.1;

export const PlayerHand = ({
  cards,
  playableKeys,
  selectedKey,
  trump,
  hasHints = false,
  sortMode,
  cardScale = 'normal',
  isInstant = false,
  dropZones = [],
  onDropOn,
  onDropMiss,
  onHover,
  onDragStart,
  onDragEnd,
  onSelect
}: PlayerHandProps) => {
  const { width, height, available } = useCardSize(cardScale, EDGE_PADDING);

  const sorted = sortHand(cards, trump, sortMode);
  const count = sorted.length;

  const overlap = fanOverlap(count, width, available);
  const fanDrop = height * FAN_DROP_RATIO;

  return (
    <View style={[styles.root, { minHeight: height + fanDrop }]}>
      {sorted.map((card, index) => {
        const key = cardKey(card);
        const offset = count > 1 ? index / (count - 1) - 0.5 : 0;
        const isLast = index === count - 1;

        return (
          <Animated.View
            key={key}
            entering={isInstant ? undefined : SlideInRight.springify().damping(30).stiffness(380)}
            exiting={isInstant ? undefined : FadeOut.duration(160)}
            layout={isInstant ? undefined : LinearTransition.springify().damping(30).stiffness(380)}
            style={{ zIndex: index, marginRight: isLast ? 0 : overlap }}
          >
            <View style={{ transform: [{ translateY: Math.abs(offset) * fanDrop }] }}>
              <DraggableCard
                card={card}
                dropZones={dropZones}
                isDimmed={hasHints && playableKeys.size > 0 && !playableKeys.has(key)}
                isPlayable={playableKeys.has(key)}
                isSelected={selectedKey === key}
                rotation={offset * MAX_FAN_ANGLE}
                width={width}
                onDragEnd={() => onDragEnd?.()}
                onDragStart={() => onDragStart?.(card)}
                onDropMiss={() => onDropMiss?.(card)}
                onDropOn={(pairIndex) => onDropOn?.(card, pairIndex)}
                onHover={(hovered) => onHover?.(hovered)}
                onPlay={() => onSelect(card)}
              />
            </View>
          </Animated.View>
        );
      })}
    </View>
  );
};
