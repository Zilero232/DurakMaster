'use client';

import { createGame, decideBotAction, reduce } from '@durak-master/game-core';
import { DEFAULT_TABLE_SETTINGS } from '@durak-master/schemas';
import { create } from 'zustand';

import type { GameAction, GameState, TableSettings } from '@durak-master/schemas';

/**
 * Криптографическая случайность браузера.
 *
 * Только для игры против ботов на устройстве. В сетевой игре колоду тасует
 * сервер — клиентскому RNG доверять нельзя, иначе раздача предсказуема.
 */
const browserRandomInt = (maxExclusive: number): number => {
  const buffer = new Uint32Array(1);

  crypto.getRandomValues(buffer);

  return (buffer[0] ?? 0) % maxExclusive;
};

export type GamePlayer = {
  id: string;
  name: string;
  isBot: boolean;
};

type GameStore = {
  state: GameState | null;
  players: GamePlayer[];
  selectedKey: string | null;
  lastError: string | null;
  /** Версия, на которой была подсвечена ошибка, — чтобы гасить её при новом ходе. */
  errorVersion: number;

  startGame: (players: GamePlayer[], settings?: TableSettings) => void;
  dispatch: (action: GameAction) => void;
  runBotTurn: () => void;
  selectCard: (key: string | null) => void;
  clearError: () => void;
  leaveGame: () => void;
};

/**
 * Состояние партии.
 *
 * Стор специально держит ПОЛНОЕ состояние (`GameState`), а компоненты читают
 * его только через `toPlayerView` — так локальная игра использует ровно те же
 * структуры, что придут по сети, и переход на онлайн не потребует переписывать UI.
 */
export const useGameStore = create<GameStore>((set, get) => ({
  state: null,
  players: [],
  selectedKey: null,
  lastError: null,
  errorVersion: -1,

  startGame: (players, settings) => {
    set({
      players,
      state: createGame({
        tableId: 'local',
        settings: settings ?? DEFAULT_TABLE_SETTINGS,
        userIds: players.map((player) => player.id),
        randomInt: browserRandomInt,
      }),
      selectedKey: null,
      lastError: null,
      errorVersion: -1,
    });
  },

  dispatch: (action) => {
    const { state, players } = get();
    const me = players[0];

    if (!state || !me) {
      return;
    }

    const result = reduce(state, me.id, action);

    if (!result.ok) {
      set({ lastError: result.error, errorVersion: state.version });

      return;
    }

    set({ state: result.state, selectedKey: null, lastError: null });
  },

  runBotTurn: () => {
    const { state, players } = get();

    if (!state || state.phase === 'finished') {
      return;
    }

    const actor = state.players.find((player) => player.seat === state.activeSeat);
    const actorMeta = players.find((player) => player.id === actor?.userId);

    if (!actor || !actorMeta?.isBot || actor.isOut) {
      return;
    }

    const action = decideBotAction(state, actor.userId);
    const result = reduce(state, actor.userId, action);

    if (result.ok) {
      set({ state: result.state });

      return;
    }

    // Бот предложил недопустимое действие — пасуем, чтобы партия не зависла.
    const fallback = reduce(state, actor.userId, { type: 'pass' });

    if (fallback.ok) {
      set({ state: fallback.state });
    }
  },

  selectCard: (key) => set({ selectedKey: key }),
  clearError: () => set({ lastError: null }),
  leaveGame: () => set({ state: null, players: [], selectedKey: null, lastError: null }),
}));
