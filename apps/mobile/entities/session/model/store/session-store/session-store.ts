import type { GameAction } from '@durak-master/schemas';

import { create } from 'zustand';

import { socketClient } from '@/shared/api';
import { playSound } from '@/shared/lib/sound';

import type { SessionStore } from './session-store.types';

import { INITIAL_STATE } from './session-store.config';
import { createConnection } from './session-store.connection';
import { reduceServerMessage } from './session-store.reduce';

export const useSessionStore = create<SessionStore>((set, get) => {
  const connection = createConnection({
    onMessage: (message) => {
      if (message.type === 'table:emoji' || message.type === 'table:phrase') {
        playSound('click');
      }

      const next = reduceServerMessage(get(), message);

      if (next) {
        set(next);
      }
    },
    onStatus: (status) => set({ status }),
    getStatus: () => get().status,
    isLobbySubscribed: () => get().isLobbySubscribed
  });

  return {
    ...INITIAL_STATE,

    selectTableCard: (key) => set({ selectedTableCardKey: key }),

    connect: async () => {
      if (get().status !== 'idle') {
        return;
      }

      set({ status: 'connecting' });

      await connection.open();
    },

    disconnect: () => {
      connection.close();

      set({
        status: 'idle',
        profile: null,
        currentTable: null,
        view: null,
        isLobbySubscribed: false
      });
    },

    subscribeLobby: () => {
      set({ isLobbySubscribed: true });
      socketClient.send({ type: 'lobby:subscribe' });
    },

    createTable: (settings, password) =>
      socketClient.send({ type: 'table:create', payload: { settings, password } }),

    joinTable: (tableId, password) =>
      socketClient.send({ type: 'table:join', payload: { tableId, password } }),

    leaveTable: () => socketClient.send({ type: 'table:leave' }),

    setReady: (isReady) => socketClient.send({ type: 'table:ready', payload: { isReady } }),

    addBot: () => socketClient.send({ type: 'table:add-bot' }),

    sendPhrase: (phraseId) => socketClient.send({ type: 'table:phrase', payload: { phraseId } }),

    sendEmoji: (emoji) => socketClient.send({ type: 'table:emoji', payload: { emoji } }),

    claimBonus: () => socketClient.send({ type: 'profile:claim-bonus' }),

    setProfile: (profile) => set({ profile }),

    setAvatar: (seed) => socketClient.send({ type: 'profile:set-avatar', payload: { seed } }),

    setName: (name) => socketClient.send({ type: 'profile:set-name', payload: { name } }),

    clearOutcome: () => set({ outcome: null }),

    clearRejection: () => set({ rejectedCode: null }),

    clearError: () => set({ lastError: null, lastErrorCode: null })
  };
});

export const sendGameAction = (action: GameAction, expectedVersion: number) => {
  socketClient.send({ type: 'game:action', payload: { action, expectedVersion } });
};
