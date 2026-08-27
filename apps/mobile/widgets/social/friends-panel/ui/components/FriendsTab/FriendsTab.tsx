import { Users } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import type { FriendsTabProps } from './FriendsTab.types';

import { EmptyState } from '../EmptyState';
import { FriendRow } from '../FriendRow';
import { styles } from './FriendsTab.styles';

export const FriendsTab = ({ friends, canInvite, onAction, onFind }: FriendsTabProps) => {
  const { t } = useTranslation();

  if (friends.length === 0) {
    return (
      <EmptyState
        action={{ label: t('friends.tabs.search'), onPress: onFind }}
        hint={t('friends.emptyFriendsHint')}
        icon={Users}
        title={t('friends.emptyFriends')}
      />
    );
  }

  return (
    <View style={styles.list}>
      {friends.map((friend) => (
        <FriendRow
          key={friend.profile.userId}
          actions={canInvite ? ['invite', 'remove'] : ['remove']}
          isOnline={friend.profile.isOnline}
          profile={friend.profile}
          tableId={friend.tableId}
          onAction={onAction}
        />
      ))}
    </View>
  );
};
