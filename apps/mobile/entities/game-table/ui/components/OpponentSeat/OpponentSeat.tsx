import { Pressable } from 'react-native';
import Animated from 'react-native-reanimated';

import type { OpponentSeatProps } from './OpponentSeat.types';

import { useCardSize, useSeatSize, useTurnPulse } from '../../../model';
import { SeatCards, SeatIdentity } from './components';
import { MIN_BACK_WIDTH, SEAT_INNER_PADDING } from './OpponentSeat.config';
import { BACK_SCALE, BACK_STEP_X, styles } from './OpponentSeat.styles';

export const OpponentSeat = ({
  seatCount,
  arcLift = 0,
  isEmpty = false,
  isReady = false,
  player,
  name,
  avatarUrl = null,
  phrase,
  turnDeadline = null,
  turnSeconds = 0,
  isAttacker,
  isDefender,
  isActive,
  isStatic = false,
  isLoser = false,
  onPress
}: OpponentSeatProps) => {
  const metrics = useSeatSize(seatCount);
  const { width: cardWidth } = useCardSize();
  const pulse = useTurnPulse(isActive, isStatic);

  const roomForCards = metrics.maxWidth - SEAT_INNER_PADDING - BACK_STEP_X * 5;

  const backWidth = Math.max(
    MIN_BACK_WIDTH,
    Math.min(cardWidth * BACK_SCALE, metrics.maxWidth * BACK_SCALE, roomForCards)
  );

  return (
    <Animated.View style={[pulse, { marginTop: -arcLift }]}>
      <Pressable
        style={({ pressed }) => [
          styles.root,
          { maxWidth: metrics.maxWidth },
          isEmpty && styles.empty,
          isActive && styles.active,
          player.isOut && styles.out,
          pressed && styles.pressed
        ]}
        accessibilityLabel={name}
        accessibilityRole='button'
        disabled={isEmpty}
        onPress={onPress}
      >
        <SeatCards backWidth={backWidth} handCount={player.handCount} userId={player.userId} />

        <SeatIdentity
          arcLift={arcLift}
          avatarUrl={avatarUrl}
          isActive={isActive}
          isAttacker={isAttacker}
          isDefender={isDefender}
          isDisconnected={player.isDisconnected}
          isEmpty={isEmpty}
          isLoser={isLoser}
          isOut={player.isOut}
          isReady={isReady}
          name={name}
          phrase={phrase}
          seatCount={seatCount}
          turnDeadline={turnDeadline}
          turnSeconds={turnSeconds}
        />
      </Pressable>
    </Animated.View>
  );
};
