import type {
  AchievementId,
  AchievementState,
  FriendList,
  Leaderboard,
  PublicProfile,
  TableInvite
} from '@durak-master/schemas';

import { create } from 'zustand';

import { socketClient } from '@/shared/api';

const EMPTY_LIST: FriendList = { friends: [], incoming: [], outgoing: [] };

type SocialStore = {
  friends: FriendList;

  found: PublicProfile[];
  achievements: AchievementState[];
  leaderboard: Leaderboard;

  invite: TableInvite | null;

  freshlyUnlocked: AchievementId[];

  hasLoaded: boolean;

  loadFriends: () => void;
  searchFriends: (query: string) => void;
  clearSearch: () => void;
  requestFriend: (userId: string) => void;
  acceptFriend: (userId: string) => void;
  declineFriend: (userId: string) => void;
  removeFriend: (userId: string) => void;
  inviteFriend: (userId: string) => void;

  loadAchievements: () => void;
  loadLeaderboard: () => void;
  claimAchievement: (achievementId: AchievementId) => void;

  setFriends: (friends: FriendList) => void;
  setFound: (found: PublicProfile[]) => void;
  setAchievements: (achievements: AchievementState[]) => void;
  setLeaderboard: (leaderboard: Leaderboard) => void;
  setInvite: (invite: TableInvite | null) => void;
  setFreshlyUnlocked: (ids: AchievementId[]) => void;
  clearFreshlyUnlocked: () => void;

  reset: () => void;
};

export const useSocialStore = create<SocialStore>()((set) => ({
  friends: EMPTY_LIST,
  found: [],
  achievements: [],
  leaderboard: { entries: [], myRank: null },
  invite: null,
  freshlyUnlocked: [],
  hasLoaded: false,

  loadFriends: () => socketClient.send({ type: 'friends:list' }),

  searchFriends: (query) => socketClient.send({ type: 'friends:search', payload: { query } }),

  clearSearch: () => set({ found: [] }),

  requestFriend: (userId) => socketClient.send({ type: 'friends:request', payload: { userId } }),

  acceptFriend: (userId) => socketClient.send({ type: 'friends:accept', payload: { userId } }),

  declineFriend: (userId) => socketClient.send({ type: 'friends:decline', payload: { userId } }),

  removeFriend: (userId) => socketClient.send({ type: 'friends:remove', payload: { userId } }),

  inviteFriend: (userId) => socketClient.send({ type: 'friends:invite', payload: { userId } }),

  loadAchievements: () => socketClient.send({ type: 'achievements:list' }),

  loadLeaderboard: () => socketClient.send({ type: 'leaderboard:list' }),

  claimAchievement: (achievementId) => {
    socketClient.send({ type: 'achievements:claim', payload: { achievementId } });

    socketClient.send({ type: 'achievements:list' });
  },

  setFriends: (friends) => set({ friends, hasLoaded: true }),
  setFound: (found) => set({ found }),
  setAchievements: (achievements) => set({ achievements, hasLoaded: true }),
  setLeaderboard: (leaderboard) => set({ leaderboard, hasLoaded: true }),
  setInvite: (invite) => set({ invite }),
  setFreshlyUnlocked: (freshlyUnlocked) => set({ freshlyUnlocked }),

  clearFreshlyUnlocked: () => set({ freshlyUnlocked: [] }),

  reset: () =>
    set({
      friends: EMPTY_LIST,
      found: [],
      achievements: [],
      leaderboard: { entries: [], myRank: null },
      invite: null,
      freshlyUnlocked: [],
      hasLoaded: false
    })
}));

socketClient.subscribe((message) => {
  const store = useSocialStore.getState();

  switch (message.type) {
    case 'friends:list': {
      store.setFriends(message.payload);
      break;
    }

    case 'friends:found': {
      store.setFound(message.payload.profiles);
      break;
    }

    case 'friends:invited': {
      store.setInvite(message.payload);
      break;
    }

    case 'achievements:list': {
      store.setAchievements(message.payload.achievements);
      break;
    }

    case 'leaderboard:list': {
      store.setLeaderboard(message.payload);
      break;
    }

    case 'achievements:unlocked': {
      store.setFreshlyUnlocked(message.payload.ids);
      break;
    }

    default: {
      break;
    }
  }
});
