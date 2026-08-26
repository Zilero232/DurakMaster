import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';

import { SeatChatter, SeatTimer } from '@/entities/game-table';
import { Avatar } from '@/ui-kit';

import type { SeatButtonProps } from './SeatButton.types';

import { AVATAR_DIAMETER, RING_DIAMETER, styles } from '../../TableActions.styles';

export const SeatButton = ({
  profile,
  chatter,
  isMyTurn,
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
