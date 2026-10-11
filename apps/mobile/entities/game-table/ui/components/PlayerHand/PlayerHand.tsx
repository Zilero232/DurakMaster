import { View } from 'react-native';

import { cardKey } from '@/shared/lib/cards';
import { card as cardTokens } from '@/ui-kit';

import type { PlayerHandProps } from './PlayerHand.types';

import { fanOverlap, sortHand } from '../../../lib';
import { useCardSize } from '../../../model';
import { HandCard } from './components';
import { FAN_DROP_RATIO } from './PlayerHand.config';
import { EDGE_PADDING, styles } from './PlayerHand.styles';

export const PlayerHand = ({
  cards,
  playableKeys,
  selectedKey = null,
  trump,
  hasHints = false,
  sortMode,
  isInstant = false,
  dropZones = [],
  onDropOn,
  onDropMiss,
  onHover,
  onDragStart,
  onDragEnd,
  onSelect
}: PlayerHandProps) => {
  const { width, height, available } = useCardSize(EDGE_PADDING);

  const sorted = sortHand({ cards, trump, mode: sortMode });
  const count = sorted.length;

  const overlap = fanOverlap({ count, width, available, looseRatio: cardTokens.overlap });
  const fanDrop = height * FAN_DROP_RATIO;

  return (
    <View style={[styles.root, { minHeight: height + fanDrop }]}>
      {sorted.map((card, index) => {
        const key = cardKey(card);
        const offset = count > 1 ? index / (count - 1) - 0.5 : 0;
        const isLast = index === count - 1;

        return (
          <HandCard
            key={key}
            card={card}
            dropZones={dropZones}
            fanDrop={fanDrop}
            hasHint={hasHints && playableKeys.has(key)}
            index={index}
            isInstant={isInstant}
            isLast={isLast}
            isPlayable={playableKeys.has(key)}
            isSelected={selectedKey === key}
            offset={offset}
            overlap={overlap}
            width={width}
            onDragEnd={() => onDragEnd?.()}
            onDragStart={() => onDragStart?.(card)}
            onDropMiss={(travelY) => onDropMiss?.(card, travelY)}
            onDropOn={(pairIndex) => onDropOn?.(card, pairIndex)}
            onHover={(hovered) => onHover?.(hovered)}
            onPlay={() => onSelect(card)}
          />
        );
      })}
    </View>
  );
};
