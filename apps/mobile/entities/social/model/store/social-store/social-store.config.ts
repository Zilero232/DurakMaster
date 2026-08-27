import type { FriendList } from '@durak-master/schemas';

import type { SocialState } from './social-store.types';

export const EMPTY_FRIEND_LIST: FriendList = { friends: [], incoming: [], outgoing: [] };

export const INITIAL_STATE: SocialState = {
  friends: EMPTY_FRIEND_LIST,
  found: [],
  achievements: [],
  leaderboard: { entries: [], myRank: null },
  invite: null,
  freshlyUnlocked: [],
  hasLoaded: false
};
