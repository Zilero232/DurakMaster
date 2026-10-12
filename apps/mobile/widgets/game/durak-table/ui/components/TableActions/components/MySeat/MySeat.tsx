import { View } from 'react-native';

import { SeatChatter, SeatTimer } from '@/entities/game-table';
import { Avatar, PRIMARY_ACTION_HEIGHT } from '@/ui-kit';

import type { MySeatProps } from './MySeat.types';

import { AVATAR_DIAMETER, styles } from './MySeat.styles';

export const MySeat = ({ profile, chatter, isMyTurn, turnDeadline, turnSeconds }: MySeatProps) => (
  <View style={styles.root}>
    <View style={styles.ring}>
      <Avatar name={profile?.name ?? ''} size={AVATAR_DIAMETER} src={profile?.avatarUrl ?? null} />

      {isMyTurn && (
        <SeatTimer
          deadline={turnDeadline}
          size={PRIMARY_ACTION_HEIGHT}
          totalSeconds={turnSeconds}
        />
      )}

      <SeatChatter chatter={chatter} size={AVATAR_DIAMETER} />
    </View>
  </View>
);
