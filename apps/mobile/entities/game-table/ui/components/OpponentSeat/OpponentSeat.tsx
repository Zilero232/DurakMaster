import { Pressable } from 'react-native';

import type { OpponentSeatProps } from './OpponentSeat.types';

import { useCardSize, useSeatSize } from '../../../model';
import { SeatCards, SeatIdentity } from './components';
import { BACK_SCALE, styles } from './OpponentSeat.styles';

export const OpponentSeat = ({
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
  isLoser = false,
  onPress
}: OpponentSeatProps) => {
  const metrics = useSeatSize();
  const { width: cardWidth } = useCardSize();

  const backWidth = Math.min(cardWidth * BACK_SCALE, metrics.maxWidth * BACK_SCALE);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.root,
        { maxWidth: metrics.maxWidth, minWidth: metrics.minWidth },
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
      <SeatCards
        backWidth={backWidth}
        handCount={player.handCount}
        seat={player.seat}
        userId={player.userId}
      />

      <SeatIdentity
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
        turnDeadline={turnDeadline}
        turnSeconds={turnSeconds}
      />
    </Pressable>
  );
};
