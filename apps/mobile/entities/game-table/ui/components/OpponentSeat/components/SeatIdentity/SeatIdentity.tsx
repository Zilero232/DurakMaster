import { Check } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { Avatar, colors, LoserHat } from '@/ui-kit';

import type { SeatIdentityProps } from './SeatIdentity.types';

import { useSeatSize } from '../../../../../model';
import { SeatChatter } from '../../../SeatChatter';
import { SeatTimer } from '../../../SeatTimer';
import { styles } from './SeatIdentity.styles';

const CHECK_SIZE = 12;

export const SeatIdentity = ({
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

  const seat = useSeatSize();

  return (
    <View style={styles.identity}>
      <View style={[styles.avatarRing, isEmpty && styles.emptyRing]}>
        <Avatar name={isEmpty ? '' : name} size={seat.avatar} src={avatarUrl} />

        {isActive && turnSeconds > 0 && (
          <SeatTimer deadline={turnDeadline} size={seat.ring} totalSeconds={turnSeconds} />
        )}

        <SeatChatter chatter={phrase} size={seat.avatar} />

        {isLoser && <LoserHat size={seat.hat} style={styles.hat} />}

        {isReady && (
          <View style={styles.ready}>
            <Check color={colors.background} size={CHECK_SIZE} strokeWidth={3.5} />
          </View>
        )}
      </View>

      <View style={styles.info}>
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
    </View>
  );
};
