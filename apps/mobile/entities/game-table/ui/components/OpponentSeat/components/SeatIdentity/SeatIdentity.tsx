import { Check, Hourglass } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { match } from 'ts-pattern';

import { Avatar, colors, LoserHat } from '@/ui-kit';

import { useSeatContext } from '../../../../../model';
import { SeatChatter } from '../../../SeatChatter';
import { SeatTimer } from '../../../SeatTimer';
import { CHECK_SIZE, EMPTY_ICON_RATIO } from './SeatIdentity.config';
import { styles } from './SeatIdentity.styles';

export const SeatIdentity = () => {
  const { t } = useTranslation();

  const seat = useSeatContext();

  const role = match(seat)
    .with({ isDefender: true }, () => ({ text: t('table.role.defends'), tone: styles.defender }))
    .with({ isAttacker: true }, () => ({ text: t('table.role.attacks'), tone: null }))
    .with({ isDisconnected: true }, () => ({ text: t('table.role.offline'), tone: styles.offline }))
    .with({ isOut: true }, () => ({ text: t('table.role.out'), tone: null }))
    .otherwise(() => null);

  return (
    <View style={styles.identity}>
      <View style={[styles.avatarRing, seat.isEmpty && styles.emptyRing]}>
        {seat.isEmpty ? (
          <Hourglass
            color={colors.subtleForeground}
            size={seat.metrics.avatar * EMPTY_ICON_RATIO}
          />
        ) : (
          <Avatar name={seat.name} size={seat.metrics.avatar} src={seat.avatarUrl} />
        )}

        {seat.isActive && seat.turnSeconds > 0 && (
          <SeatTimer
            deadline={seat.turnDeadline}
            size={seat.metrics.ring}
            totalSeconds={seat.turnSeconds}
          />
        )}

        {seat.isLoser && (
          <LoserHat
            size={seat.metrics.hat}
            style={[styles.hat, { top: -seat.metrics.hat * 0.68, left: -seat.metrics.hat * 0.22 }]}
          />
        )}

        {seat.isReady && (
          <View style={styles.ready}>
            <Check color={colors.background} size={CHECK_SIZE} strokeWidth={3.5} />
          </View>
        )}
      </View>

      <Text numberOfLines={1} style={[styles.name, { fontSize: seat.metrics.label }]}>
        {seat.name}
      </Text>

      {role && (
        <Text style={[styles.role, role.tone, { fontSize: seat.metrics.label }]}>{role.text}</Text>
      )}

      <SeatChatter
        arcLift={seat.arcLift}
        chatter={seat.phrase}
        placement='below'
        size={seat.metrics.avatar}
      />
    </View>
  );
};
