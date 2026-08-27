import { Crown, Pencil } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';

import { Avatar, colors, iconSize } from '@/ui-kit';

import type { PlayerIdentityProps } from './PlayerIdentity.types';

import { styles } from './PlayerIdentity.styles';

export const PlayerIdentity = ({
  name,
  avatarUrl,
  rank,
  isPremium,
  onEdit
}: PlayerIdentityProps) => {
  const { t } = useTranslation();

  return (
    <Pressable
      accessibilityHint={t('profile.editHint')}
      accessibilityRole='button'
      style={({ pressed }) => [styles.root, pressed && styles.pressed]}
      onPress={onEdit}
    >
      <View style={styles.avatarWrap}>
        <Avatar name={name} size={52} src={avatarUrl} />

        <Text style={styles.level}>{rank.level}</Text>

        <View style={styles.editBadge}>
          <Pencil color={colors.primaryForeground} size={iconSize.xs} />
        </View>
      </View>

      <View style={styles.info}>
        <Text numberOfLines={1} style={styles.name}>
          {name}
        </Text>

        <Text numberOfLines={1} style={[styles.league, { color: rank.league.color }]}>
          {t(`profile.leagues.${rank.league.id}`)}
        </Text>
      </View>

      {isPremium && (
        <Crown
          accessibilityLabel={t('profile.premium')}
          color={colors.gold}
          size={iconSize.lg}
          style={styles.premium}
        />
      )}
    </Pressable>
  );
};
