import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import Animated, { FadeOut, ZoomIn } from 'react-native-reanimated';

import { Avatar } from '@/ui-kit';

import type { OpponentSeatProps } from './OpponentSeat.types';

import { BACK_STEP_ANGLE, BACK_STEP_X, styles } from './OpponentSeat.styles';

const MAX_VISIBLE_BACKS = 6;

export const OpponentSeat = ({
  player,
  name,
  avatarUrl = null,
  phrase,
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
          />
        ))}

        {player.handCount > 0 && <Text style={styles.count}>{player.handCount}</Text>}
      </View>

      <View style={styles.identity}>
        <Avatar name={name} size={28} src={avatarUrl} />

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

      {phrase && (
        <Animated.Text
          key={phrase}
          entering={ZoomIn.springify().damping(14).stiffness(220)}
          exiting={FadeOut.duration(200)}
          numberOfLines={2}
          style={styles.phrase}
        >
          {phrase}
        </Animated.Text>
      )}
    </View>
  );
};
