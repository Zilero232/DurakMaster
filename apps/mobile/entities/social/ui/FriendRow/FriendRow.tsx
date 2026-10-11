import type { LucideIcon } from 'lucide-react-native';

import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';
import { match, P } from 'ts-pattern';

import { Avatar, colors, iconSize, Panel } from '@/ui-kit';

import type { FriendRowAction, FriendRowProps } from './FriendRow.types';

import { ACTION_HIT_SLOP, AVATAR_SIZE, ICONS, INERT, PRIMARY } from './FriendRow.config';
import { styles } from './FriendRow.styles';

export const FriendRow = <Action extends FriendRowAction>({
  profile,
  isOnline = false,
  tableId = null,
  actions,
  onAction
}: FriendRowProps<Action>) => {
  const { t } = useTranslation();

  const shownActions: FriendRowAction[] = actions;
  const isInvited = shownActions.includes('invited');

  const meta = match({ isInvited, tableId, isOnline })
    .with({ isInvited: true }, () => t('friends.inviteSent'))
    .with({ tableId: P.string }, () => t('friends.atTable'))
    .with({ isOnline: true }, () => t('friends.online'))
    .otherwise(() => t('friends.offline'));

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
          const Icon: LucideIcon = ICONS[action];
          const isPrimary = PRIMARY.includes(action);
          const isInert = INERT.includes(action);

          return (
            <Pressable
              key={action}
              accessibilityLabel={t(`friends.action.${action}`)}
              accessibilityRole='button'
              accessibilityState={{ disabled: isInert }}
              disabled={isInert}
              hitSlop={ACTION_HIT_SLOP}
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
