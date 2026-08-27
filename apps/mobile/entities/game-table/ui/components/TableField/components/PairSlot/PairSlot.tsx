import { View } from 'react-native';
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';

import { PlayingCard } from '@/ui-kit';

import type { PairSlotProps } from './PairSlot.types';

import { slideFrom, sweepToDiscard } from '../../../../../lib';
import { usePairMeasure } from '../../../../../model';
import { createPairStyles, DEFENSE_ROTATION, styles } from '../../TableField.styles';

export const PairSlot = ({
  pair,
  index,
  canBeat,
  isHovered,
  width,
  height,
  mySeat,
  isInstant = false,
  onDefend,
  onMeasure
}: PairSlotProps) => {
  const pairStyles = createPairStyles(width, height);

  const { viewRef, measure } = usePairMeasure({
    index,
    width,
    height,
    hasDefense: Boolean(pair.defense),
    onMeasure
  });

  return (
    <Animated.View
      layout={isInstant ? undefined : LinearTransition.springify().damping(28).stiffness(420)}
      style={pairStyles.pair}
    >
      <Animated.View
        ref={viewRef}
        entering={isInstant ? undefined : slideFrom(pair.attackSeat === mySeat)}
        exiting={isInstant ? undefined : sweepToDiscard}
        style={pairStyles.pair}
        onLayout={measure}
      >
        <View style={[styles.attack, canBeat && styles.beatable, isHovered && styles.hovered]}>
          <PlayingCard
            card={pair.attack}
            isPlayable={canBeat}
            width={width}
            onPress={() => onDefend(index)}
          />
        </View>

        {pair.defense && (
          <Animated.View
            entering={isInstant ? undefined : slideFrom(pair.defenseSeat === mySeat)}
            style={pairStyles.defense}
          >
            <PlayingCard card={pair.defense} rotation={DEFENSE_ROTATION} width={width} />
          </Animated.View>
        )}

        {isHovered && !pair.defense && (
          <Animated.View
            entering={FadeIn.duration(120)}
            exiting={FadeOut.duration(120)}
            style={pairStyles.dropHint}
          />
        )}
      </Animated.View>
    </Animated.View>
  );
};
