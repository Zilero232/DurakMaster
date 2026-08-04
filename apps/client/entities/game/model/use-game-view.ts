'use client';

import { beats, isLegalAttackCard, toPlayerView } from '@durak-master/game-core';
import { useEffect } from 'react';

import { useGameStore } from './game-store';

import type { Card, PlayerView } from '@durak-master/schemas';

export const cardKey = (card: Card) => `${card.rank}:${card.suit}`;

/** Пауза перед ходом бота: мгновенные ходы читаются как сбой интерфейса. */
const BOT_THINK_MS = 650;

/** Ключи карт руки, которыми сейчас можно сходить. */
export function getPlayableKeys(view: PlayerView | null, isMyTurn: boolean, isDefending: boolean) {
  const keys = new Set<string>();

  if (!view || !isMyTurn) {
    return keys;
  }

  for (const card of view.hand) {
    if (isDefending) {
      // Защищаясь — карта играбельна, если бьёт хоть одну неотбитую.
      const canBeatSomething = view.table.some(
        (pair) => pair.defense === null && beats(card, pair.attack, view.trump),
      );

      if (canBeatSomething) {
        keys.add(cardKey(card));
      }

      continue;
    }

    if (isLegalAttackCard(card, view.table, view.attackLimit)) {
      keys.add(cardKey(card));
    }
  }

  return keys;
}

/** Индексы пар на столе, которые бьются выбранной картой. */
export function getBeatableIndexes(view: PlayerView | null, selectedCard: Card | null) {
  const indexes = new Set<number>();

  if (!view || !selectedCard) {
    return indexes;
  }

  view.table.forEach((pair, index) => {
    if (pair.defense === null && beats(selectedCard, pair.attack, view.trump)) {
      indexes.add(index);
    }
  });

  return indexes;
}

/**
 * Данные стола для локальной игры против ботов.
 *
 * Мемоизация не расставлена вручную: включён React Compiler, он сам
 * кэширует вычисления и функции по зависимостям.
 */
export const useGameView = () => {
  const state = useGameStore((store) => store.state);
  const players = useGameStore((store) => store.players);
  const selectedKey = useGameStore((store) => store.selectedKey);
  const lastError = useGameStore((store) => store.lastError);
  const runBotTurn = useGameStore((store) => store.runBotTurn);

  const me = players[0] ?? null;
  const view = state && me ? toPlayerView(state, me.id) : null;

  const mySeat = view?.players.find((player) => player.userId === me?.id)?.seat ?? 0;
  const isMyTurn = Boolean(view) && view?.activeSeat === mySeat && view?.phase !== 'finished';
  const isDefending = view?.defenderSeat === mySeat;

  const selectedCard = view?.hand.find((card) => cardKey(card) === selectedKey) ?? null;
  const playableKeys = getPlayableKeys(view, isMyTurn, isDefending);
  const beatableIndexes =
    isDefending && isMyTurn ? getBeatableIndexes(view, selectedCard) : new Set<number>();

  const hasUndefended = view?.table.some((pair) => pair.defense === null) ?? false;

  // Ходы ботов. Таймер пересоздаётся на каждое состояние — это и есть
  // условие продолжения цепочки, пока активен бот.
  useEffect(() => {
    if (!state || state.phase === 'finished') {
      return;
    }

    const actor = state.players.find((player) => player.seat === state.activeSeat);
    const actorMeta = players.find((player) => player.id === actor?.userId);

    if (!actorMeta?.isBot) {
      return;
    }

    const timer = setTimeout(runBotTurn, BOT_THINK_MS);

    return () => clearTimeout(timer);
  }, [state, players, runBotTurn]);

  return {
    view,
    me,
    players,
    mySeat,
    isMyTurn,
    isDefending,
    selectedCard,
    selectedKey,
    playableKeys,
    beatableIndexes,
    lastError,
    /** «Беру» доступно защищающемуся при неотбитых картах. */
    canTake: isMyTurn && isDefending && hasUndefended,
    /** «Бито» доступно атакующему, когда всё отбито. */
    canPass: isMyTurn && !isDefending && (view?.table.length ?? 0) > 0 && !hasUndefended,
  };
};
