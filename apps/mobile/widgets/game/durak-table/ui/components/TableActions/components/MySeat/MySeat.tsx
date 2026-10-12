import { Smile } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';

import { SeatChatter, SeatTimer } from '@/entities/game-table';
import { Avatar, colors, iconSize, PRIMARY_ACTION_HEIGHT } from '@/ui-kit';

import type { MySeatProps } from './MySeat.types';

import { AVATAR_DIAMETER, styles } from './MySeat.styles';

export const MySeat = ({
  profile,
  chatter,
  isMyTurn,
  turnDeadline,
  turnSeconds,
  onOpenEmojis
}: MySeatProps) => {
  const { t } = useTranslation();

  return (
    <Pressable
      accessibilityLabel={t('emojis.title')}
      accessibilityRole='button'
      style={({ pressed }) => [styles.root, pressed && styles.pressed]}
      onPress={onOpenEmojis}
    >
      <View style={styles.ring}>
        <Avatar
          name={profile?.name ?? ''}
          size={AVATAR_DIAMETER}
          src={profile?.avatarUrl ?? null}
        />

        {isMyTurn && (
          <SeatTimer
            deadline={turnDeadline}
            size={PRIMARY_ACTION_HEIGHT}
            totalSeconds={turnSeconds}
          />
        )}

        <SeatChatter chatter={chatter} size={AVATAR_DIAMETER} />
      </View>

      <View style={styles.badge}>
        <Smile color={colors.onFelt} size={iconSize.xs} />
      </View>
    </Pressable>
  );
};
