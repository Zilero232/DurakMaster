import type {
  GameAction,
  GameErrorCode,
  LobbyTable,
  MyProfile,
  PlayerView,
  PublicProfile,
  QuickPhraseId,
  ServerMessage,
  TablePhrase,
  TableSettings
} from '@durak-master/schemas';

import { create } from 'zustand';

import { getAuthToken, socketClient } from '@/shared/api';
import { WS_URL } from '@/shared/config';

export type ConnectionStatus = 'connected' | 'connecting' | 'error' | 'idle';

export type GameOutcome = {
  loserUserId: string | null;
  isDraw: boolean;
  creditsDelta: number;
  ratingDelta: number;
};

type SessionStore = {
  status: ConnectionStatus;
  profile: MyProfile | null;

  tables: LobbyTable[];
  currentTable: LobbyTable | null;
  mySeat: number | null;

  view: PlayerView | null;
  tablePlayers: PublicProfile[];
  outcome: GameOutcome | null;

  phrases: TablePhrase[];
  emojis: Record<string, { emoji: string; at: number }>;

  lastError: string | null;
  rejectedCode: GameErrorCode | null;

  selectedTableCardKey: string | null;
  selectTableCard: (key: string | null) => void;

  connect: () => Promise<void>;
  disconnect: () => void;

  subscribeLobby: () => void;
  createTable: (settings: TableSettings, password?: string) => void;
  joinTable: (tableId: string, password?: string) => void;
  leaveTable: () => void;
  setReady: (isReady: boolean) => void;
  addBot: () => void;

  sendPhrase: (phraseId: QuickPhraseId) => void;
  sendEmoji: (emoji: string) => void;
  claimBonus: () => void;

  clearOutcome: () => void;
  clearRejection: () => void;
  clearError: () => void;
};

export const useSessionStore = create<SessionStore>((set, get) => {
  const handleMessage = (message: ServerMessage) => {
    switch (message.type) {
      case 'connected':
        set({ status: 'connected', profile: message.payload.profile });
        break;

      case 'profile:updated':
        set({ profile: message.payload.profile });
        break;

      case 'lobby:tables':
        set({ tables: message.payload.tables });
        break;

      case 'lobby:table-updated': {
        const updated = message.payload.table;

        set((state) => ({
          tables: state.tables.some((table) => table.id === updated.id)
            ? state.tables.map((table) => (table.id === updated.id ? updated : table))
            : [updated, ...state.tables],
          currentTable: state.currentTable?.id === updated.id ? updated : state.currentTable
        }));
        break;
      }

      case 'lobby:table-removed':
        set((state) => ({
          tables: state.tables.filter((table) => table.id !== message.payload.tableId)
        }));
        break;

      case 'table:joined':
        set({
          currentTable: message.payload.table,
          mySeat: message.payload.seat,
          outcome: null,
          phrases: []
        });
        break;

      case 'table:left':
        set({ currentTable: null, mySeat: null, view: null, outcome: null, phrases: [] });
        break;

      case 'game:state':
        set({
          view: message.payload.view,
          tablePlayers: message.payload.players,
          selectedTableCardKey: null,
          rejectedCode: null
        });
        break;

      case 'game:rejected':
        set({ rejectedCode: message.payload.code });
        break;

      case 'game:finished':
        set({ outcome: message.payload });
        break;

      case 'table:phrase':
        set((state) => ({ phrases: [...state.phrases.slice(-19), message.payload.phrase] }));
        break;

      case 'table:emoji':
        set((state) => ({
          emojis: {
            ...state.emojis,
            [message.payload.userId]: { emoji: message.payload.emoji, at: Date.now() }
          }
        }));
        break;

      case 'error':
        set({ lastError: message.payload.message });
        break;

      default:
        break;
    }
  };

  return {
    status: 'idle',
    profile: null,
    tables: [],
    currentTable: null,
    mySeat: null,
    view: null,
    tablePlayers: [],
    outcome: null,
    phrases: [],
    emojis: {},
    lastError: null,
    rejectedCode: null,
    selectedTableCardKey: null,

    selectTableCard: (key) => set({ selectedTableCardKey: key }),

    connect: async () => {
      if (get().status !== 'idle') {
        return;
      }

      set({ status: 'connecting' });

      socketClient.subscribe(handleMessage);

      const token = await getAuthToken();

      socketClient.connect(token ? `${WS_URL}?token=${encodeURIComponent(token)}` : WS_URL);
    },

    disconnect: () => {
      socketClient.disconnect();
      set({ status: 'idle', profile: null, currentTable: null, view: null });
    },

    subscribeLobby: () => socketClient.send({ type: 'lobby:subscribe' }),

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

    clearOutcome: () => set({ outcome: null }),

    clearRejection: () => set({ rejectedCode: null }),

    clearError: () => set({ lastError: null })
  };
});

export const sendGameAction = (action: GameAction, expectedVersion: number) => {
  socketClient.send({ type: 'game:action', payload: { action, expectedVersion } });
};
