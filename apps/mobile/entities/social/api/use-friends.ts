import type { FriendList } from '@durak-master/schemas';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import {
  acceptFriend,
  declineFriend,
  fetchFriends,
  FRIENDS_QUERY_KEY,
  removeFriend,
  requestFriend,
  searchProfiles
} from './social-api';

const EMPTY_FRIENDS: FriendList = { friends: [], incoming: [], outgoing: [] };

export const useFriends = () => {
  const queryClient = useQueryClient();

  const list = useQuery({ queryKey: FRIENDS_QUERY_KEY, queryFn: fetchFriends });

  const [query, setQuery] = useState('');

  const found = useQuery({
    queryKey: [...FRIENDS_QUERY_KEY, 'search', query],
    queryFn: () => searchProfiles(query),
    enabled: query.length > 0
  });

  const onSuccess = () => queryClient.invalidateQueries({ queryKey: FRIENDS_QUERY_KEY });

  const request = useMutation({ mutationFn: requestFriend, onSuccess });
  const accept = useMutation({ mutationFn: acceptFriend, onSuccess });
  const decline = useMutation({ mutationFn: declineFriend, onSuccess });
  const remove = useMutation({ mutationFn: removeFriend, onSuccess });

  return {
    friends: list.data ?? EMPTY_FRIENDS,
    found: query.length > 0 ? (found.data ?? []) : [],
    isPending: list.isPending,

    search: setQuery,
    clearSearch: () => setQuery(''),

    request: (userId: string) => request.mutate(userId),
    accept: (userId: string) => accept.mutate(userId),
    decline: (userId: string) => decline.mutate(userId),
    remove: (userId: string) => remove.mutate(userId)
  };
};
