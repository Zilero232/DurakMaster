import { View } from 'react-native';
import Animated, { FadeOut, LinearTransition } from 'react-native-reanimated';

import { cardKey } from '@/shared/lib/cards';
import { duration, MAX_FAN_ANGLE } from '@/ui-kit';

import type { PlayerHandProps } from './PlayerHand.types';

import { dealFromTalon, sortHand } from '../../../lib';
import { useCardSize } from '../../../model';
import { DraggableCard } from './components';
import { FAN_DROP_RATIO } from './PlayerHand.config';
import { EDGE_PADDING, fanOverlap, styles } from './PlayerHand.styles';

export const PlayerHand = ({
  cards,
  playableKeys,
  selectedKey = null,
  selectedKeys,
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
            entering={isInstant ? undefined : dealFromTalon}
            exiting={isInstant ? undefined : FadeOut.duration(160)}
            layout={isInstant ? undefined : LinearTransition.duration(duration.layout)}
            style={{ zIndex: index, marginRight: isLast ? 0 : overlap }}
          >
            <View style={{ transform: [{ translateY: Math.abs(offset) * fanDrop }] }}>
              <DraggableCard
                card={card}
                dropZones={dropZones}
                hasHint={hasHints && playableKeys.has(key)}
                isPlayable={playableKeys.has(key)}
                isSelected={selectedKeys ? selectedKeys.has(key) : selectedKey === key}
                rotation={offset * MAX_FAN_ANGLE}
                width={width}
                onDragEnd={() => onDragEnd?.()}
                onDragStart={() => onDragStart?.(card)}
                onDropMiss={(travelY) => onDropMiss?.(card, travelY)}
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
