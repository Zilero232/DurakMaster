import { Text, View } from 'react-native';

import { PlayingCard } from '@/ui-kit';

import type { SeatCardsProps } from './SeatCards.types';

import { BACK_STEP_ANGLE, BACK_STEP_X } from '../../OpponentSeat.styles';
import { MAX_VISIBLE_BACKS } from './SeatCards.config';
import { styles } from './SeatCards.styles';

const fan = (index: number) => ({
  transform: [
    { translateX: index * BACK_STEP_X },
    { rotate: `${(index - 2) * BACK_STEP_ANGLE}deg` }
  ]
});

export const SeatCards = ({ userId, handCount, backWidth }: SeatCardsProps) => {
  const visible = Math.min(handCount, MAX_VISIBLE_BACKS);
  const backs = Array.from({ length: visible }, (_, index) => index);

  if (handCount === 0) {
    return null;
  }

  return (
    <View style={[styles.cards, { width: backWidth + BACK_STEP_X * 5 }]}>
      {backs.map((index) => (
        <View key={`back-${userId}-${index}`} style={[styles.back, fan(index)]}>
          <PlayingCard card={null} width={backWidth} />
        </View>
      ))}

      <Text style={styles.count}>{handCount}</Text>
    </View>
  );
};
