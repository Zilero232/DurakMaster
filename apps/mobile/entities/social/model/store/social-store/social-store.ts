import { create } from 'zustand';

import { socketClient } from '@/shared/api';

import type { SocialStore } from './social-store.types';

import { INITIAL_STATE } from './social-store.config';

export const useSocialStore = create<SocialStore>()((set) => ({
  ...INITIAL_STATE,

  inviteFriend: (userId) => socketClient.send({ type: 'friends:invite', payload: { userId } }),

  setInvite: (invite) => set({ invite }),
  setFreshlyUnlocked: (freshlyUnlocked) => set({ freshlyUnlocked }),
  clearFreshlyUnlocked: () => set({ freshlyUnlocked: [] }),

  reset: () => set(INITIAL_STATE)
}));
