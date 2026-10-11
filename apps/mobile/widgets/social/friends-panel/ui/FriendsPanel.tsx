import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { match } from 'ts-pattern';

import { useFriends } from '@/entities/social';
import { SegmentedControl, Sheet } from '@/ui-kit';

import type { FriendsPanelProps, ManageAction, FriendsTab as Tab } from './FriendsPanel.types';

import { FriendsTab, RemoveFriendConfirm, RequestsTab, SearchTab } from './components';
import { MIN_QUERY } from './FriendsPanel.config';
import { styles } from './FriendsPanel.styles';

export const FriendsPanel = ({ isOpen, onClose }: FriendsPanelProps) => {
  const { t } = useTranslation();

  const { friends, found, search, clearSearch, request, accept, decline, remove } = useFriends();

  const [tab, setTab] = useState<Tab>('friends');
  const [removingId, setRemovingId] = useState<string | null>(null);

  const handleSearch = (query: string) => {
    if (query.trim().length >= MIN_QUERY) {
      search(query);
    } else {
      clearSearch();
    }
  };

  const handleAction = (action: ManageAction, userId: string) => {
    match(action)
      .with('add', () => request(userId))
      .with('accept', () => accept(userId))
      .with('decline', () => decline(userId))
      .with('remove', () => setRemovingId(userId))
      .exhaustive();
  };

  const confirmRemove = () => {
    if (removingId) {
      remove(removingId);
    }

    setRemovingId(null);
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

        <RemoveFriendConfirm
          isOpen={removingId !== null}
          onCancel={() => setRemovingId(null)}
          onConfirm={confirmRemove}
        />
      </View>
    </Sheet>
  );
};
