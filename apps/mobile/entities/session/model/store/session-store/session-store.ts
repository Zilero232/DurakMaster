import type { GameAction } from '@durak-master/schemas';

import { create } from 'zustand';

import { socketClient } from '@/shared/api';
import { playSound } from '@/shared/lib/sound';

import type { SessionStore } from './session-store.types';

import { INITIAL_STATE } from './session-store.config';
import { listenToSocket } from './session-store.connection';
import { cacheProfileFrom } from './session-store.profile-cache';
import { LEFT_TABLE_STATE, reduceServerMessage } from './session-store.reduce';

export const useSessionStore = create<SessionStore>((set, get) => {
  listenToSocket({
    onMessage: (message) => {
      if (message.type === 'table:emoji' || message.type === 'table:phrase') {
        playSound('chat');
      }

      cacheProfileFrom(message);

      const next = reduceServerMessage(get(), message);

      if (next) {
        set(next);
      }
    },
    onStatus: (status) => set({ status }),
    onDisconnected: () => set({ isJoiningTable: false, joiningTableId: null })
  });

  return {
    ...INITIAL_STATE,

    connect: () => {
      const { status, isSigningOut } = get();

      if (isSigningOut || status === 'connecting' || status === 'connected') {
        return;
      }

      set({ status: 'connecting' });
      socketClient.connect();
    },

    disconnect: () => {
      socketClient.disconnect();

      set({ ...INITIAL_STATE, isSigningOut: get().isSigningOut });
    },

    setSigningOut: (isSigningOut) => set({ isSigningOut }),

    subscribeLobby: () => socketClient.send({ type: 'lobby:subscribe' }),

    createTable: (settings, password) => {
      const isSent = socketClient.send({ type: 'table:create', payload: { settings, password } });

      set({ isJoiningTable: isSent, joiningTableId: null });
    },
    joinTable: (tableId, password) => {
      const isSent = socketClient.send({ type: 'table:join', payload: { tableId, password } });

      set({ isJoiningTable: isSent, joiningTableId: isSent ? tableId : null });
    },

    leaveTable: () => {
      socketClient.send({ type: 'table:leave' });
      set(LEFT_TABLE_STATE);
    },

    goToMenu: () => {
      get().leaveTable();
      set({ outcome: null });
    },
    setReady: (isReady) => socketClient.send({ type: 'table:ready', payload: { isReady } }),
    addBot: () => socketClient.send({ type: 'table:add-bot' }),
    applyBoost: (boost, targetUserId) =>
      socketClient.send({ type: 'table:boost', payload: { boost, targetUserId } }),
    sendPhrase: (phraseId) => socketClient.send({ type: 'table:phrase', payload: { phraseId } }),
    sendEmoji: (emoji) => socketClient.send({ type: 'table:emoji', payload: { emoji } }),

    selectTableCard: (key) => set({ selectedTableCardKey: key }),

    clearRejection: () => set({ rejectedCode: null }),
    clearRevealed: () => set({ revealed: null }),
    clearError: () => set({ lastError: null, lastErrorCode: null })
  };
});

export const sendGameAction = (action: GameAction, expectedVersion: number) => {
  socketClient.send({ type: 'game:action', payload: { action, expectedVersion } });
};
