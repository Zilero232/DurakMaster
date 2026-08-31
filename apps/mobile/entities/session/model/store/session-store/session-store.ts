import type { GameAction } from '@durak-master/schemas';

import { create } from 'zustand';

import { socketClient } from '@/shared/api';
import { playSound } from '@/shared/lib/sound';

import type { SessionStore } from './session-store.types';

import { INITIAL_STATE } from './session-store.config';
import { createConnection } from './session-store.connection';
import { cacheProfileFrom } from './session-store.profile-cache';
import { reduceServerMessage } from './session-store.reduce';

export const useSessionStore = create<SessionStore>((set, get) => {
  const connection = createConnection({
    onMessage: (message) => {
      if (message.type === 'table:emoji' || message.type === 'table:phrase') {
        playSound('click');
      }

      cacheProfileFrom(message);

      const next = reduceServerMessage(get(), message);

      if (next) {
        set(next);
      }
    },
    onStatus: (status) => set({ status }),
    onDisconnected: () => set({ isJoiningTable: false, joiningTableId: null }),
    getStatus: () => get().status,
    isLobbySubscribed: () => get().isLobbySubscribed
  });

  return {
    ...INITIAL_STATE,

    connect: async () => {
      if (get().status === 'connecting' || get().status === 'connected') {
        return;
      }

      set({ status: 'connecting' });

      await connection.open();
    },

    disconnect: () => {
      connection.close();

      set({ ...INITIAL_STATE });
    },

    subscribeLobby: () => {
      set({ isLobbySubscribed: true });
      socketClient.send({ type: 'lobby:subscribe' });
    },

    createTable: (settings, password) => {
      set({ isJoiningTable: socketClient.isConnected, joiningTableId: null });
      socketClient.send({ type: 'table:create', payload: { settings, password } });
    },
    joinTable: (tableId, password) => {
      set({ isJoiningTable: socketClient.isConnected, joiningTableId: tableId });
      socketClient.send({ type: 'table:join', payload: { tableId, password } });
    },

    leaveTable: () => socketClient.send({ type: 'table:leave' }),
    setReady: (isReady) => socketClient.send({ type: 'table:ready', payload: { isReady } }),
    addBot: () => socketClient.send({ type: 'table:add-bot' }),
    applyBoost: (boost, targetUserId) =>
      socketClient.send({ type: 'table:boost', payload: { boost, targetUserId } }),
    sendPhrase: (phraseId) => socketClient.send({ type: 'table:phrase', payload: { phraseId } }),
    sendEmoji: (emoji) => socketClient.send({ type: 'table:emoji', payload: { emoji } }),

    selectTableCard: (key) => set({ selectedTableCardKey: key }),

    clearOutcome: () => set({ outcome: null }),
    clearRejection: () => set({ rejectedCode: null }),
    clearRevealed: () => set({ revealed: null }),
    clearError: () => set({ lastError: null, lastErrorCode: null })
  };
});

export const sendGameAction = (action: GameAction, expectedVersion: number) => {
  socketClient.send({ type: 'game:action', payload: { action, expectedVersion } });
};
