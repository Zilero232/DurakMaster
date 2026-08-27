import { View } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
  SlideInDown,
  SlideInUp
} from 'react-native-reanimated';

import { PlayingCard } from '@/ui-kit';

import type { PairSlotProps } from './PairSlot.types';

import { sweepToDiscard } from '../../../../../lib';
import { usePairMeasure } from '../../../../../model';
import { createPairStyles, DEFENSE_ROTATION, styles } from '../../TableField.styles';

export const PairSlot = ({
  pair,
  index,
  canBeat,
  isHovered,
  width,
  height,
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
      ref={viewRef}
      entering={isInstant ? undefined : SlideInUp.springify().damping(22).stiffness(220)}
      exiting={isInstant ? undefined : sweepToDiscard}
      layout={isInstant ? undefined : LinearTransition.springify().damping(28).stiffness(420)}
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
          entering={isInstant ? undefined : SlideInDown.springify().damping(20).stiffness(200)}
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
  );
};
