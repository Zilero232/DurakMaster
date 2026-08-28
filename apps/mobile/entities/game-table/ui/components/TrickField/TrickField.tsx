import { View } from 'react-native';
import Animated, { FadeOut, LinearTransition } from 'react-native-reanimated';

import { cardKey } from '@/shared/lib/cards';
import { duration, PlayingCard } from '@/ui-kit';

import type { TrickFieldProps, TrickPlay } from './TrickField.types';

import { slideFrom } from '../../../lib';
import { useCardSize } from '../../../model';
import { styles } from './TrickField.styles';

const playKey = (play: TrickPlay): string => {
  const [first] = play.cards;

  return first ? `${play.seat}-${cardKey(first)}` : `${play.seat}-hidden-${play.cards.length}`;
};

export const TrickField = ({
  plays,
  mySeat,
  bestIndex = null,
  cardScale = 'normal',
  isInstant = false
}: TrickFieldProps) => {
  const { width } = useCardSize(cardScale);

  return (
    <View style={styles.root}>
      {plays.map((play, index) => (
        <Animated.View
          key={playKey(play)}
          entering={isInstant ? undefined : slideFrom(play.seat === mySeat)}
          exiting={isInstant ? undefined : FadeOut.duration(200)}
          layout={isInstant ? undefined : LinearTransition.duration(duration.layout)}
          style={[styles.play, index === bestIndex && styles.best]}
        >
          {play.cards.map((card, cardIndex) => (
            <PlayingCard
              key={card ? cardKey(card) : `${play.seat}-hidden-${String(cardIndex)}`}
              card={card}
              width={width}
            />
          ))}
        </Animated.View>
      ))}
    </View>
  );
};
