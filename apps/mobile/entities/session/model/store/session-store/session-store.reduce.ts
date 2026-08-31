import type { ServerMessage } from '@durak-master/schemas';

import { cardKey } from '@durak-master/game-core';

import type { SessionState } from './session-store.types';

import { PHRASE_HISTORY_LIMIT } from './session-store.config';

export const reduceServerMessage = (
  state: SessionState,
  message: ServerMessage
): Partial<SessionState> | null => {
  switch (message.type) {
    case 'connected':
      return { status: 'connected' };

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
        isJoiningTable: false,
        joiningTableId: null,
        currentTable: message.payload.table,
        mySeat: message.payload.seat,
        outcome: null,
        phrases: [],
        emojis: {},
        revealed: null
      };

    case 'table:left':
      return {
        isJoiningTable: false,
        joiningTableId: null,
        currentTable: null,
        mySeat: null,
        view: null,
        phrases: [],
        emojis: {},
        revealed: null,
        tablePlayers: [],
        selectedTableCardKey: null
      };

    case 'table:boost-used':
      return {
        revealed: {
          boost: message.payload.boost,
          cards: message.payload.talon ?? message.payload.hand ?? [],
          targetUserId: message.payload.targetUserId ?? null
        }
      };

    case 'game:state': {
      const { view } = message.payload;

      const stillHeld =
        state.selectedTableCardKey !== null &&
        'hand' in view &&
        view.hand.some((card) => cardKey(card) === state.selectedTableCardKey);

      return {
        view,
        tablePlayers: message.payload.players,
        selectedTableCardKey: stillHeld ? state.selectedTableCardKey : null,
        rejectedCode: null,

        outcome: view.phase === 'playing' ? null : state.outcome
      };
    }

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
        isJoiningTable: false,
        joiningTableId: null,
        lastErrorCode: message.payload.code ?? null,
        lastError: message.payload.message
      };

    default:
      return null;
  }
};
