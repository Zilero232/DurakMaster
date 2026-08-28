import { Text, View } from 'react-native';

import { PlayingCard } from '@/ui-kit';

import type { SeatCardsProps } from './SeatCards.types';

import { BACK_STEP_ANGLE, BACK_STEP_X } from '../../OpponentSeat.styles';
import { styles } from './SeatCards.styles';

const MAX_VISIBLE_BACKS = 6;

const SKELETON_BACKS = [0, 1, 2, 3];

const fan = (index: number) => ({
  transform: [
    { translateX: index * BACK_STEP_X },
    { rotate: `${(index - 2) * BACK_STEP_ANGLE}deg` }
  ]
});

export const SeatCards = ({ seat, userId, handCount, backWidth }: SeatCardsProps) => {
  const visible = Math.min(handCount, MAX_VISIBLE_BACKS);
  const backs = Array.from({ length: visible }, (_, index) => index);

  return (
    <View style={styles.cards}>
      {handCount === 0 &&
        SKELETON_BACKS.map((index) => (
          <View
            key={`ghost-${seat}-${index}`}
            style={[styles.back, styles.ghostBack, fan(index)]}
          />
        ))}

      {backs.map((index) => (
        <View key={`back-${userId}-${index}`} style={[styles.back, fan(index)]}>
          <PlayingCard card={null} width={backWidth} />
        </View>
      ))}

      {handCount > 0 && <Text style={styles.count}>{handCount}</Text>}
    </View>
  );
};
