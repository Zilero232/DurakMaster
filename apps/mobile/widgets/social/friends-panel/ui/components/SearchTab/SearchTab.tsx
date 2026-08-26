import { useDebounceCallback } from '@siberiacancode/reactuse';
import { Search, UserRoundX } from 'lucide-react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TextInput, View } from 'react-native';

import { colors, iconSize } from '@/ui-kit';

import type { SearchTabProps } from './SearchTab.types';

import { EmptyState } from '../EmptyState';
import { FriendRow } from '../FriendRow';
import { styles } from './SearchTab.styles';

const DEBOUNCE_MS = 350;
const MIN_QUERY = 2;

export const SearchTab = ({ found, onSearch, onAction }: SearchTabProps) => {
  const { t } = useTranslation();

  const [query, setQuery] = useState('');

  const search = useDebounceCallback(onSearch, DEBOUNCE_MS);

  const handleQuery = (next: string) => {
    setQuery(next);
    search(next);
  };

  const isSearching = query.trim().length >= MIN_QUERY;

  return (
    <View style={styles.list}>
      <View style={styles.searchWrap}>
        <Search color={colors.subtleForeground} size={iconSize.sm} style={styles.searchIcon} />

        <TextInput
          autoCapitalize='none'
          placeholder={t('friends.searchPlaceholder')}
          placeholderTextColor={colors.subtleForeground}
          style={styles.search}
          value={query}
          onChangeText={handleQuery}
        />
      </View>

      {found.length === 0 ? (
        <EmptyState
          icon={isSearching ? UserRoundX : Search}
          title={isSearching ? t('friends.nothingFound') : t('friends.searchHint')}
        />
      ) : (
        found.map((profile) => (
          <FriendRow key={profile.userId} actions={['add']} profile={profile} onAction={onAction} />
        ))
      )}
    </View>
  );
};
