import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';

import { Avatar, colors, iconSize, Panel } from '@/ui-kit';

import type { FriendRowProps } from './FriendRow.types';

import { AVATAR_SIZE, ICONS, PRIMARY } from './FriendRow.config';
import { styles } from './FriendRow.styles';

export const FriendRow = ({
  profile,
  isOnline = false,
  tableId = null,
  actions,
  onAction
}: FriendRowProps) => {
  const { t } = useTranslation();

  const meta = tableId
    ? t('friends.atTable')
    : isOnline
      ? t('friends.online')
      : t('friends.offline');

  return (
    <Panel padding='compact' style={styles.root}>
      <View style={styles.avatarWrap}>
        <Avatar name={profile.name} size={AVATAR_SIZE} src={profile.avatarUrl} />

        {isOnline && <View style={styles.online} />}
      </View>

      <View style={styles.info}>
        <Text numberOfLines={1} style={styles.name}>
          {profile.name}
        </Text>

        <Text style={styles.meta}>{meta}</Text>
      </View>

      <View style={styles.actions}>
        {actions.map((action) => {
          const Icon = ICONS[action];
          const isPrimary = PRIMARY.includes(action);

          return (
            <Pressable
              key={action}
              accessibilityLabel={t(`friends.action.${action}`)}
              accessibilityRole='button'
              style={[styles.action, isPrimary && styles.accent]}
              onPress={() => onAction(action, profile.userId)}
            >
              <Icon
                color={isPrimary ? colors.primaryForeground : colors.mutedForeground}
                size={iconSize.sm}
              />
            </Pressable>
          );
        })}
      </View>
    </Panel>
  );
};
