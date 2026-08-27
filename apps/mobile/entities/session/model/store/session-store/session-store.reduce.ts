import type { ServerMessage } from '@durak-master/schemas';

import type { SessionState } from './session-store.types';

import { PHRASE_HISTORY_LIMIT } from './session-store.config';

export const reduceServerMessage = (
  state: SessionState,
  message: ServerMessage
): Partial<SessionState> | null => {
  switch (message.type) {
    case 'connected':
      return { status: 'connected', profile: message.payload.profile };

    case 'profile:updated':
      return { profile: message.payload.profile };

    case 'lobby:tables':
      return { tables: message.payload.tables };

    case 'lobby:table-updated': {
      const updated = message.payload.table;

      return {
        tables: state.tables.some((table) => table.id === updated.id)
          ? state.tables.map((table) => (table.id === updated.id ? updated : table))
          : [updated, ...state.tables],
        currentTable: state.currentTable?.id === updated.id ? updated : state.currentTable
      };
    }

    case 'lobby:table-removed':
      return { tables: state.tables.filter((table) => table.id !== message.payload.tableId) };

    case 'table:joined':
      return {
        currentTable: message.payload.table,
        mySeat: message.payload.seat,
        outcome: null,
        phrases: []
      };

    case 'table:left':
      return {
        currentTable: null,
        mySeat: null,
        view: null,
        outcome: null,
        phrases: []
      };

    case 'game:state':
      return {
        view: message.payload.view,
        tablePlayers: message.payload.players,
        selectedTableCardKey: null,
        rejectedCode: null,

        outcome: message.payload.view.phase === 'playing' ? null : state.outcome
      };

    case 'game:rejected':
      return { rejectedCode: message.payload.code };

    case 'game:finished':
      return { outcome: message.payload };

    case 'table:phrase':
      return {
        phrases: [...state.phrases.slice(-(PHRASE_HISTORY_LIMIT - 1)), message.payload.phrase]
      };

    case 'table:emoji':
      return {
        emojis: {
          ...state.emojis,
          [message.payload.userId]: { emoji: message.payload.emoji, at: Date.now() }
        }
      };

    case 'error':
      return {
        lastErrorCode: message.payload.code ?? null,
        lastError: message.payload.message
      };

    default:
      return null;
  }
};
