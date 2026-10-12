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
  rowWidth,
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
  onPress
}: OpponentSeatProps) => {
  const metrics = useSeatSize({ seats: seatCount, rowWidth });
  const pulse = useTurnPulse(isActive, isStatic);

  const fannedBacks = Math.max(0, Math.min(player.handCount, MAX_VISIBLE_BACKS) - 1);

  const roomForCards = metrics.width - SEAT_PADDING_X * 2 - BACK_STEP_X * fannedBacks;

  const backWidth = Math.max(MIN_BACK_WIDTH, Math.min(metrics.back, roomForCards));

  const isInvitable = isEmpty && Boolean(onPress);

  const seat: SeatContextValue = {
    metrics,
    arcLift,
    name,
    avatarUrl,
    handCount: player.handCount,
    backWidth,
    isEmpty,
    isInvitable,
    isActive,
    isReady,
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
          { width: metrics.width },
          isEmpty && styles.empty,
          isInvitable && styles.invitable,
          isActive && styles.active,
          player.isOut && styles.out,
          pressed && styles.pressed
        ]}
        accessibilityLabel={name}
        accessibilityRole='button'
        disabled={!onPress}
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
