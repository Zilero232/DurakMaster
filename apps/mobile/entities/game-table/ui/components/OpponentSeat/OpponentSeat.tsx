import { Pressable } from 'react-native';
import Animated from 'react-native-reanimated';

import type { SeatContextValue } from '../../../model';
import type { OpponentSeatProps } from './OpponentSeat.types';

import { SeatProvider, useSeatSize, useTurnPulse } from '../../../model';
import { MAX_VISIBLE_BACKS, SeatCards, SeatIdentity } from './components';
import { MIN_BACK_WIDTH } from './OpponentSeat.config';
import { BACK_STEP_X, SEAT_PADDING_X, styles } from './OpponentSeat.styles';

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
  const pulse = useTurnPulse(isActive, isStatic);

  const fannedBacks = Math.max(0, Math.min(player.handCount, MAX_VISIBLE_BACKS) - 1);

  const roomForCards = metrics.maxWidth - SEAT_PADDING_X * 2 - BACK_STEP_X * fannedBacks;

  const backWidth = Math.max(MIN_BACK_WIDTH, Math.min(metrics.back, roomForCards));

  const seat: SeatContextValue = {
    metrics,
    arcLift,
    name,
    avatarUrl,
    handCount: player.handCount,
    backWidth,
    isEmpty,
    isActive,
    isReady,
    isLoser,
    isAttacker,
    isDefender,
    isOut: player.isOut,
    isDisconnected: player.isDisconnected,
    phrase,
    turnDeadline,
    turnSeconds
  };

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
        <SeatProvider value={seat}>
          <SeatCards />

          <SeatIdentity />
        </SeatProvider>
      </Pressable>
    </Animated.View>
  );
};
