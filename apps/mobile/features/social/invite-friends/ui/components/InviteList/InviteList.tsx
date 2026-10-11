import { UserRoundSearch, Users } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { match } from 'ts-pattern';

import { FriendRow } from '@/entities/social';
import { EmptyState, iconSize, Spinner } from '@/ui-kit';

import { useInviteList } from '../../../model/hooks';
import { styles } from './InviteList.styles';

export const InviteList = () => {
  const { t } = useTranslation();

  const { rows, hasFriends, offlineCount, isPending, invite } = useInviteList();

  return match({ isPending, hasFriends, hasRows: rows.length > 0 })
    .with({ isPending: true }, () => (
      <View style={styles.loading}>
        <Spinner size={iconSize.lg} />
      </View>
    ))
    .with({ hasFriends: false }, () => (
      <EmptyState
        hint={t('friends.inviteNoFriendsHint')}
        icon={Users}
        title={t('friends.emptyFriends')}
      />
    ))
    .with({ hasRows: false }, () => (
      <EmptyState
        hint={t('friends.inviteNobodyOnlineHint')}
        icon={UserRoundSearch}
        title={t('friends.inviteNobodyOnline')}
      />
    ))
    .otherwise(() => (
      <View style={styles.list}>
        {rows.map(({ friend, action }) => (
          <FriendRow
            key={friend.profile.userId}
            actions={[action]}
            isOnline={friend.profile.isOnline}
            profile={friend.profile}
            tableId={friend.tableId}
            onAction={() => invite(friend.profile)}
          />
        ))}

        {offlineCount > 0 && (
          <Text style={styles.note}>{t('friends.inviteOffline', { count: offlineCount })}</Text>
        )}
      </View>
    ));
};
