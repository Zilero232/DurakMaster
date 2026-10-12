import { Check, Hourglass, UserPlus, WifiOff } from 'lucide-react-native';
import { View } from 'react-native';

import { Avatar, colors } from '@/ui-kit';

import { useSeatContext } from '../../../../../model';
import { SeatTimer } from '../../../SeatTimer';
import { BADGE_ICON_SIZE, EMPTY_ICON_RATIO } from './SeatAvatar.config';
import { styles } from './SeatAvatar.styles';

export const SeatAvatar = () => {
  const seat = useSeatContext();

  const EmptyIcon = seat.isInvitable ? UserPlus : Hourglass;

  return (
    <View style={[styles.ring, seat.isEmpty && styles.emptyRing]}>
      {seat.isEmpty ? (
        <EmptyIcon
          color={seat.isInvitable ? colors.accentBright : colors.subtleForeground}
          size={seat.metrics.avatar * EMPTY_ICON_RATIO}
        />
      ) : (
        <View style={seat.isDisconnected && styles.offlineAvatar}>
          <Avatar name={seat.name} size={seat.metrics.avatar} src={seat.avatarUrl} />
        </View>
      )}

      {seat.isActive && seat.turnSeconds > 0 && (
        <SeatTimer
          deadline={seat.turnDeadline}
          size={seat.metrics.ring}
          totalSeconds={seat.turnSeconds}
        />
      )}

      {seat.isReady && (
        <View style={[styles.badge, styles.ready]}>
          <Check color={colors.background} size={BADGE_ICON_SIZE} strokeWidth={3.5} />
        </View>
      )}

      {seat.isDisconnected && (
        <View style={[styles.badge, styles.offline]}>
          <WifiOff color={colors.foreground} size={BADGE_ICON_SIZE} strokeWidth={3} />
        </View>
      )}
    </View>
  );
};
