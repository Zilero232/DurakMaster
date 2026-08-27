import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { Avatar, LoserHat, PlayingCard } from '@/ui-kit';

import type { OpponentSeatProps } from './OpponentSeat.types';

import { SeatChatter } from '../SeatChatter';
import { SeatTimer } from '../SeatTimer';
import {
  AVATAR_SIZE,
  BACK_STEP_ANGLE,
  BACK_STEP_X,
  backSize,
  HAT_SIZE,
  RING_SIZE,
  styles
} from './OpponentSeat.styles';

const MAX_VISIBLE_BACKS = 6;

export const OpponentSeat = ({
  player,
  name,
  avatarUrl = null,
  isLoser = false,
  phrase,
  turnDeadline = null,
  turnSeconds = 0,
  isAttacker,
  isDefender,
  isActive
}: OpponentSeatProps) => {
  const { t } = useTranslation();

  const visible = Math.min(player.handCount, MAX_VISIBLE_BACKS);
  const backs = Array.from({ length: visible }, (_, index) => index);

  return (
    <View style={[styles.root, isActive && styles.active, player.isOut && styles.out]}>
      <View style={styles.cards}>
        {backs.map((index) => (
          <View
            key={`back-${player.userId}-${index}`}
            style={[
              styles.back,
              {
                transform: [
                  { translateX: index * BACK_STEP_X },
                  { rotate: `${(index - 2) * BACK_STEP_ANGLE}deg` }
                ]
              }
            ]}
          >
            <PlayingCard card={null} width={backSize.width} />
          </View>
        ))}

        {player.handCount > 0 && <Text style={styles.count}>{player.handCount}</Text>}
      </View>

      <View style={styles.identity}>
        <View style={styles.avatarRing}>
          <Avatar name={name} size={AVATAR_SIZE} src={avatarUrl} />

          {isActive && turnSeconds > 0 && (
            <SeatTimer deadline={turnDeadline} size={RING_SIZE} totalSeconds={turnSeconds} />
          )}

          <SeatChatter chatter={phrase} size={AVATAR_SIZE} />

          {isLoser && <LoserHat size={HAT_SIZE} style={styles.hat} />}
        </View>

        <View style={styles.info}>
          <Text numberOfLines={1} style={styles.name}>
            {name}
          </Text>

          {isAttacker && <Text style={styles.role}>{t('table.role.attacks')}</Text>}
          {isDefender && (
            <Text style={[styles.role, styles.defender]}>{t('table.role.defends')}</Text>
          )}
          {player.isOut && <Text style={styles.role}>{t('table.role.out')}</Text>}
          {player.isDisconnected && (
            <Text style={[styles.role, styles.offline]}>{t('table.role.offline')}</Text>
          )}
        </View>
      </View>
    </View>
  );
};
