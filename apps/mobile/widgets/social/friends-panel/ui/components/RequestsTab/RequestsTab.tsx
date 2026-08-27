import { Inbox } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import type { RequestsTabProps } from './RequestsTab.types';

import { EmptyState } from '../EmptyState';
import { FriendRow } from '../FriendRow';
import { styles } from './RequestsTab.styles';

export const RequestsTab = ({ incoming, outgoing, onAction }: RequestsTabProps) => {
  const { t } = useTranslation();

  if (incoming.length === 0 && outgoing.length === 0) {
    return (
      <EmptyState
        hint={t('friends.emptyRequestsHint')}
        icon={Inbox}
        title={t('friends.emptyRequests')}
      />
    );
  }

  return (
    <View style={styles.list}>
      {incoming.length > 0 && <Text style={styles.groupTitle}>{t('friends.incoming')}</Text>}

      {incoming.map((friend) => (
        <FriendRow
          key={friend.profile.userId}
          actions={['accept', 'decline']}
          profile={friend.profile}
          onAction={onAction}
        />
      ))}

      {outgoing.length > 0 && <Text style={styles.groupTitle}>{t('friends.outgoing')}</Text>}

      {outgoing.map((friend) => (
        <FriendRow
          key={friend.profile.userId}
          actions={['decline']}
          profile={friend.profile}
          onAction={onAction}
        />
      ))}
    </View>
  );
};
