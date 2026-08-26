import { View } from 'react-native';
import Animated, { FadeOut, LinearTransition, SlideInRight } from 'react-native-reanimated';

import { useSettingsStore } from '@/entities/settings';
import { cardKey, cardSize, MAX_FAN_ANGLE, PlayingCard } from '@/ui-kit';

import type { PlayerHandProps } from './PlayerHand.types';

import { styles } from './PlayerHand.styles';
import { sortHand } from './sort-hand';

const FAN_DROP = cardSize.height * 0.1;

export const PlayerHand = ({
  cards,
  playableKeys,
  selectedKey,
  trump,
  onSelect
}: PlayerHandProps) => {
  const showHints = useSettingsStore((store) => store.showHints);

  const sorted = sortHand(cards, trump);
  const count = sorted.length;

  return (
    <View style={styles.root}>
      {sorted.map((card, index) => {
        const key = cardKey(card);
        const offset = count > 1 ? index / (count - 1) - 0.5 : 0;

        return (
          <Animated.View
            key={key}
            style={[
              styles.slot,
              index === count - 1 && styles.lastSlot,
              {
                zIndex: index,
                transform: [{ translateY: Math.abs(offset) * FAN_DROP }]
              }
            ]}
            entering={SlideInRight.springify().damping(30).stiffness(380)}
            exiting={FadeOut.duration(160)}
            layout={LinearTransition.springify().damping(30).stiffness(380)}
          >
            <PlayingCard
              card={card}
              isDimmed={showHints && playableKeys.size > 0 && !playableKeys.has(key)}
              isPlayable={playableKeys.has(key)}
              isSelected={selectedKey === key}
              rotation={offset * MAX_FAN_ANGLE}
              onPress={() => onSelect(card)}
            />
          </Animated.View>
        );
      })}
    </View>
  );
};
