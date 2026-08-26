import { Crown } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { Avatar, colors } from '@/ui-kit';

import type { PlayerIdentityProps } from './PlayerIdentity.types';

import { styles } from './PlayerIdentity.styles';

export const PlayerIdentity = ({ name, avatarUrl, rank, isPremium }: PlayerIdentityProps) => {
  const { t } = useTranslation();

  return (
    <View style={styles.root}>
      <View style={styles.avatarWrap}>
        <Avatar name={name} size={52} src={avatarUrl} />

        <Text style={styles.level}>{rank.level}</Text>
      </View>

      <View style={styles.info}>
        <Text numberOfLines={1} style={styles.name}>
          {name}
        </Text>

        <Text numberOfLines={1} style={[styles.league, { color: rank.league.color }]}>
          {rank.league.name}
        </Text>
      </View>

      {isPremium && (
        <Crown
          accessibilityLabel={t('profile.premium')}
          color={colors.gold}
          size={22}
          style={styles.premium}
        />
      )}
    </View>
  );
};
