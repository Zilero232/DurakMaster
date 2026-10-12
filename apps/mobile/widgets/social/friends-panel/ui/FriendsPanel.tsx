import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { match } from 'ts-pattern';

import { InlineConfirm, SegmentedControl, Sheet } from '@/ui-kit';

import type { FriendsPanelProps } from './FriendsPanel.types';

import { useFriendsPanel } from '../model';
import { FriendsTab, RequestsTab, SearchTab } from './components';
import { styles } from './FriendsPanel.styles';

export const FriendsPanel = ({ isOpen, onClose }: FriendsPanelProps) => {
  const { t } = useTranslation();

  const {
    friends,
    found,
    tab,
    isRemoving,
    setTab,
    searchFriends,
    manage,
    confirmRemove,
    cancelRemove
  } = useFriendsPanel();

  const pending = friends.incoming.length + friends.outgoing.length;

  const tabs = [
    { value: 'friends' as const, label: t('friends.tabs.friends') },
    {
      value: 'requests' as const,
      label: pending > 0 ? `${t('friends.tabs.requests')} ${pending}` : t('friends.tabs.requests')
    },
    { value: 'search' as const, label: t('friends.tabs.search') }
  ];

  const close = () => {
    cancelRemove();
    onClose();
  };

  return (
    <Sheet isOpen={isOpen} title={t('friends.title')} onClose={close}>
      {isRemoving ? (
        <InlineConfirm
          confirmLabel={t('friends.action.remove')}
          message={t('friends.removeConfirm')}
          title={t('friends.removeTitle')}
          onCancel={cancelRemove}
          onConfirm={confirmRemove}
        />
      ) : (
        <View style={styles.root}>
          <SegmentedControl options={tabs} value={tab} onChange={setTab} />

          {match(tab)
            .with('friends', () => (
              <FriendsTab
                friends={friends.friends}
                onAction={manage}
                onFind={() => setTab('search')}
              />
            ))
            .with('requests', () => (
              <RequestsTab
                incoming={friends.incoming}
                outgoing={friends.outgoing}
                onAction={manage}
              />
            ))
            .with('search', () => (
              <SearchTab found={found} onAction={manage} onSearch={searchFriends} />
            ))
            .exhaustive()}
        </View>
      )}
    </Sheet>
  );
};
