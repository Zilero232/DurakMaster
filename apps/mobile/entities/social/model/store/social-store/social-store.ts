import { omit } from 'remeda';
import { create } from 'zustand';

import { socketClient } from '@/shared/api';

import type { SocialStore } from './social-store.types';

import { inviteKey } from '../../../lib';
import { INITIAL_STATE } from './social-store.config';

export const useSocialStore = create<SocialStore>()((set, get) => ({
  ...INITIAL_STATE,

  inviteFriend: (target) => {
    const isSent = socketClient.send({
      type: 'friends:invite',
      payload: { userId: target.userId }
    });

    if (!isSent) {
      return;
    }

    set({
      sentInvites: { ...get().sentInvites, [inviteKey(target)]: Date.now() },
      lastInvite: target
    });
  },

  forgetLastInvite: () => {
    const { lastInvite, sentInvites } = get();

    if (!lastInvite) {
      return;
    }

    set({ sentInvites: omit(sentInvites, [inviteKey(lastInvite)]), lastInvite: null });
  },

  setInvite: (invite) => set({ invite }),
  setFreshlyUnlocked: (freshlyUnlocked) => set({ freshlyUnlocked }),
  clearFreshlyUnlocked: () => set({ freshlyUnlocked: [] }),

  reset: () => set(INITIAL_STATE)
}));
