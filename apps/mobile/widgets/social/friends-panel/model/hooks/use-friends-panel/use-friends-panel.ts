import { useState } from 'react';
import { match } from 'ts-pattern';

import { useFriends } from '@/entities/social';

import type { ManageAction, FriendsTab as Tab } from './use-friends-panel.types';

import { MIN_QUERY } from '../../../config';

export const useFriendsPanel = () => {
  const { friends, found, search, clearSearch, request, accept, decline, remove } = useFriends();

  const [tab, setTab] = useState<Tab>('friends');
  const [removingId, setRemovingId] = useState<string | null>(null);

  const searchFriends = (query: string) => {
    if (query.trim().length >= MIN_QUERY) {
      search(query);
    } else {
      clearSearch();
    }
  };

  const manage = (action: ManageAction, userId: string) => {
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

  const cancelRemove = () => setRemovingId(null);

  return {
    friends,
    found,
    tab,
    isRemoving: removingId !== null,
    setTab,
    searchFriends,
    manage,
    confirmRemove,
    cancelRemove
  };
};
