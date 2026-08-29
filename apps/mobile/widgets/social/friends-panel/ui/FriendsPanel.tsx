import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { match } from 'ts-pattern';

import { useSessionStore } from '@/entities/session';
import { useFriends, useSocialStore } from '@/entities/social';
import { SegmentedControl, Sheet } from '@/ui-kit';

import type { FriendRowAction } from './components';
import type { FriendsPanelProps, FriendsTab as Tab } from './FriendsPanel.types';

import { FriendsTab, RequestsTab, SearchTab } from './components';
import { styles } from './FriendsPanel.styles';

const MIN_QUERY = 2;

export const FriendsPanel = ({ isOpen, onClose }: FriendsPanelProps) => {
  const { t } = useTranslation();

  const { friends, found, search, clearSearch, request, accept, decline, remove } = useFriends();

  const inviteFriend = useSocialStore((store) => store.inviteFriend);

  const currentTable = useSessionStore((store) => store.currentTable);

  const [tab, setTab] = useState<Tab>('friends');

  const handleSearch = (query: string) => {
    if (query.trim().length >= MIN_QUERY) {
      search(query);
    } else {
      clearSearch();
    }
  };

  const handleAction = (action: FriendRowAction, userId: string) => {
    match(action)
      .with('add', () => request(userId))
      .with('accept', () => accept(userId))
      .with('invite', () => inviteFriend(userId))
      .with('decline', () => decline(userId))
      .with('remove', () => remove(userId))
      .exhaustive();
  };

  const pending = friends.incoming.length + friends.outgoing.length;

  const tabs = [
    { value: 'friends' as const, label: t('friends.tabs.friends') },
    {
      value: 'requests' as const,
      label: pending > 0 ? `${t('friends.tabs.requests')} ${pending}` : t('friends.tabs.requests')
    },
    { value: 'search' as const, label: t('friends.tabs.search') }
  ];

  return (
    <Sheet isOpen={isOpen} title={t('friends.title')} onClose={onClose}>
      <View style={styles.root}>
        <SegmentedControl options={tabs} value={tab} onChange={setTab} />

        {match(tab)
          .with('friends', () => (
            <FriendsTab
              canInvite={Boolean(currentTable)}
              friends={friends.friends}
              onAction={handleAction}
              onFind={() => setTab('search')}
            />
          ))
          .with('requests', () => (
            <RequestsTab
              incoming={friends.incoming}
              outgoing={friends.outgoing}
              onAction={handleAction}
            />
          ))
          .with('search', () => (
            <SearchTab found={found} onAction={handleAction} onSearch={handleSearch} />
          ))
          .exhaustive()}
      </View>
    </Sheet>
  );
};
