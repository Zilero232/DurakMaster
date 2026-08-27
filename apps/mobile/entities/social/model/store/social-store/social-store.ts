import { create } from 'zustand';

import { socketClient } from '@/shared/api';

import type { SocialStore } from './social-store.types';

import { INITIAL_STATE } from './social-store.config';

export const useSocialStore = create<SocialStore>()((set) => ({
  ...INITIAL_STATE,

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

  reset: () => set(INITIAL_STATE)
}));
