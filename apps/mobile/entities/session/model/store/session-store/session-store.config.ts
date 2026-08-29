import type { SessionState } from './session-store.types';

export const PHRASE_HISTORY_LIMIT = 20;

export const INITIAL_STATE: SessionState = {
  status: 'idle',
  isLobbySubscribed: false,
  tables: [],
  currentTable: null,
  mySeat: null,
  view: null,
  tablePlayers: [],
  outcome: null,
  phrases: [],
  emojis: {},
  lastErrorCode: null,
  lastError: null,
  rejectedCode: null,
  revealed: null,
  selectedTableCardKey: null
};
