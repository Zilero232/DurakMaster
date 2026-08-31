import { Check, Hourglass } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { Avatar, colors, LoserHat } from '@/ui-kit';

import type { SeatIdentityProps } from './SeatIdentity.types';

import { useSeatSize } from '../../../../../model';
import { SeatChatter } from '../../../SeatChatter';
import { SeatTimer } from '../../../SeatTimer';
import { CHECK_SIZE, EMPTY_ICON_RATIO } from './SeatIdentity.config';
import { styles } from './SeatIdentity.styles';

export const SeatIdentity = ({
  seatCount,
  arcLift = 0,
  name,
  avatarUrl,
  isEmpty,
  isActive,
  isReady,
  isLoser,
  isAttacker,
  isDefender,
  isOut,
  isDisconnected,
  phrase,
  turnDeadline,
  turnSeconds
}: SeatIdentityProps) => {
  const { t } = useTranslation();

  const seat = useSeatSize(seatCount);

  return (
    <View style={styles.identity}>
      <View style={[styles.avatarRing, isEmpty && styles.emptyRing]}>
        {isEmpty ? (
          <Hourglass color={colors.subtleForeground} size={seat.avatar * EMPTY_ICON_RATIO} />
        ) : (
          <Avatar name={name} size={seat.avatar} src={avatarUrl} />
        )}

        {isActive && turnSeconds > 0 && (
          <SeatTimer deadline={turnDeadline} size={seat.ring} totalSeconds={turnSeconds} />
        )}

        {isLoser && <LoserHat size={seat.hat} style={styles.hat} />}

        {isReady && (
          <View style={styles.ready}>
            <Check color={colors.background} size={CHECK_SIZE} strokeWidth={3.5} />
          </View>
        )}
      </View>

      <View style={[styles.info, isEmpty && styles.emptyInfo]}>
        <Text numberOfLines={1} style={styles.name}>
          {name}
        </Text>

        {isAttacker && <Text style={styles.role}>{t('table.role.attacks')}</Text>}
        {isDefender && (
          <Text style={[styles.role, styles.defender]}>{t('table.role.defends')}</Text>
        )}
        {isOut && <Text style={styles.role}>{t('table.role.out')}</Text>}
        {isDisconnected && (
          <Text style={[styles.role, styles.offline]}>{t('table.role.offline')}</Text>
        )}
      </View>

      <SeatChatter arcLift={arcLift} chatter={phrase} placement='below' size={seat.avatar} />
    </View>
  );
};
