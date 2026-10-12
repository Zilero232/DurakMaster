import { View } from 'react-native';
import Animated, { FadeIn, FadeOut, FadeOutRight, LinearTransition } from 'react-native-reanimated';

import { duration, PlayingCard, useEnterMotion } from '@/ui-kit';

import type { PairSlotProps } from './PairSlot.types';

import { CLEAR_MS, DEFENSE_ROTATION, SLIDE_MS } from '../../../../../config';
import { slideFrom } from '../../../../../lib';
import { usePairMeasure } from '../../../../../model';
import { createPairStyles, styles } from '../../TableField.styles';

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
  const attackMotion = useEnterMotion({
    offsetY: slideFrom(pair.attackSeat === mySeat),
    durationMs: SLIDE_MS,
    isInstant
  });

  const defenseMotion = useEnterMotion({
    offsetY: slideFrom(pair.defenseSeat === mySeat),
    durationMs: SLIDE_MS,
    isInstant
  });

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
      exiting={isInstant ? undefined : FadeOutRight.duration(CLEAR_MS)}
      layout={isInstant ? undefined : LinearTransition.duration(duration.layout)}
      style={pairStyles.pair}
    >
      <Animated.View ref={viewRef} style={[pairStyles.pair, attackMotion]} onLayout={measure}>
        <View style={[styles.attack, canBeat && styles.beatable, isHovered && styles.hovered]}>
          <PlayingCard
            card={pair.attack}
            hasHint={canBeat}
            isPlayable={canBeat}
            width={width}
            onPress={() => onDefend(index)}
          />
        </View>

        {pair.defense !== null && (
          <Animated.View style={[pairStyles.defense, defenseMotion]}>
            <PlayingCard card={pair.defense} rotation={DEFENSE_ROTATION} width={width} />
          </Animated.View>
        )}

        {isHovered && !pair.defense && (
          <Animated.View
            entering={FadeIn.duration(duration.fast)}
            exiting={FadeOut.duration(duration.fast)}
            style={pairStyles.dropHint}
          />
        )}
      </Animated.View>
    </Animated.View>
  );
};
