import { Crown } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { Avatar, colors, iconSize } from '@/ui-kit';

import type { SeatedPlayersProps } from './SeatedPlayers.types';

import { formatSeatedNames } from '../../../../../lib';
import { VISIBLE_AVATARS } from '../../TableRow.config';
import { styles } from './SeatedPlayers.styles';

export const SeatedPlayers = ({ players, hasPremiumPlayer }: SeatedPlayersProps) => {
  const { t } = useTranslation();

  const names = formatSeatedNames(players);

  return (
    <View style={styles.root}>
      {players.length > 0 && (
        <View style={styles.avatars}>
          {players.slice(0, VISIBLE_AVATARS).map((player) => (
            <Avatar
              key={player.userId}
              name={player.name}
              size={iconSize.lg}
              src={player.avatarUrl}
              style={styles.avatar}
            />
          ))}
        </View>
      )}

      <Text numberOfLines={1} style={[styles.names, !names && styles.empty]}>
        {names ?? t('lobby.emptySeats')}
      </Text>

      {hasPremiumPlayer && (
        <Crown
          accessibilityLabel={t('lobby.premiumPlayer')}
          color={colors.gold}
          size={iconSize.sm}
        />
      )}
    </View>
  );
};
