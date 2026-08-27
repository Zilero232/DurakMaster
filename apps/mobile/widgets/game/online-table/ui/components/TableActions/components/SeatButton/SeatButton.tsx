import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';

import { SeatChatter, SeatTimer } from '@/entities/game-table';
import { Avatar, LoserHat } from '@/ui-kit';

import type { SeatButtonProps } from './SeatButton.types';

import { AVATAR_DIAMETER, HAT_SIZE, RING_DIAMETER, styles } from '../../TableActions.styles';

export const SeatButton = ({
  profile,
  chatter,
  isMyTurn,
  isLoser = false,
  turnDeadline,
  turnSeconds,
  onPress
}: SeatButtonProps) => {
  const { t } = useTranslation();

  return (
    <Pressable
      accessibilityLabel={t('emojis.title')}
      accessibilityRole='button'
      style={styles.identity}
      onPress={onPress}
    >
      <View style={styles.avatarRing}>
        {isLoser && <LoserHat size={HAT_SIZE} style={styles.hat} />}
        <Avatar
          name={profile?.name ?? ''}
          size={AVATAR_DIAMETER}
          src={profile?.avatarUrl ?? null}
        />

        {isMyTurn && (
          <SeatTimer deadline={turnDeadline} size={RING_DIAMETER} totalSeconds={turnSeconds} />
        )}

        <SeatChatter chatter={chatter} size={AVATAR_DIAMETER} />
      </View>
    </Pressable>
  );
};
