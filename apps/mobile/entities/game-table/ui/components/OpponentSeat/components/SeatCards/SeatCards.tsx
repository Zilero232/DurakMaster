import { View } from 'react-native';
import { times } from 'remeda';

import { PlayingCard } from '@/ui-kit';

import { seatBackHeight, useSeatContext } from '../../../../../model';
import { BACK_STEP_ANGLE, BACK_STEP_X } from '../../OpponentSeat.styles';
import { MAX_VISIBLE_BACKS } from './SeatCards.config';
import { styles } from './SeatCards.styles';

const fan = (index: number) => ({
  transform: [
    { translateX: index * BACK_STEP_X },
    { rotate: `${(index - 2) * BACK_STEP_ANGLE}deg` }
  ]
});

export const SeatCards = () => {
  const { handCount, backWidth } = useSeatContext();

  const visible = Math.min(handCount, MAX_VISIBLE_BACKS);

  if (visible === 0) {
    return null;
  }

  return (
    <View
      style={[
        styles.cards,
        { width: backWidth + BACK_STEP_X * (visible - 1), height: seatBackHeight(backWidth) }
      ]}
    >
      {times(visible, (index) => (
        <View key={index} style={[styles.back, fan(index)]}>
          <PlayingCard card={null} width={backWidth} />
        </View>
      ))}
    </View>
  );
};
