'use client';

import { cardKey, getBeatableIndexes, getPlayableKeys } from '@/entities/game';
import { sendGameAction, useSessionStore } from './session-store';

import type { Card } from '@durak-master/schemas';

/**
 * Данные стола для сетевой игры.
 *
 * Возвращает ту же форму, что и `useGameView` для локальной, — поэтому
 * компоненты стола не знают, играют они онлайн или против ботов.
 *
 * Состояние приходит с сервера уже отфильтрованным: чужих карт здесь нет
 * физически, а не «спрятаны» на клиенте.
 */
export const useOnlineGame = () => {
  const view = useSessionStore((store) => store.view);
  const profile = useSessionStore((store) => store.profile);
  const tablePlayers = useSessionStore((store) => store.tablePlayers);
  const mySeat = useSessionStore((store) => store.mySeat);
  const outcome = useSessionStore((store) => store.outcome);
  const rejectedCode = useSessionStore((store) => store.rejectedCode);
  const selectedKey = useSessionStore((store) => store.selectedTableCardKey);
  const setSelectedKey = useSessionStore((store) => store.selectTableCard);

  const seat = mySeat ?? 0;
  const isMyTurn = Boolean(view) && view?.activeSeat === seat && view?.phase !== 'finished';
  const isDefending = view?.defenderSeat === seat;

  const selectedCard = view?.hand.find((card) => cardKey(card) === selectedKey) ?? null;
  const playableKeys = getPlayableKeys(view, isMyTurn, isDefending);
  const beatableIndexes =
    isDefending && isMyTurn ? getBeatableIndexes(view, selectedCard) : new Set<number>();

  const hasUndefended = view?.table.some((pair) => pair.defense === null) ?? false;

  const play = (action: Parameters<typeof sendGameAction>[0]) => {
    if (!view) {
      return;
    }

    sendGameAction(action, view.version);
  };

  const selectCard = (card: Card) => {
    const key = cardKey(card);

    // Защищаясь — сначала выбираем карту, потом цель на столе.
    if (isDefending) {
      setSelectedKey(selectedKey === key ? null : key);

      return;
    }

    play({ type: 'attack', card });
  };

  const defendPair = (pairIndex: number) => {
    if (!selectedCard) {
      return;
    }

    play({ type: 'defend', pairIndex, card: selectedCard });
    setSelectedKey(null);
  };

  return {
    view,
    profile,
    players: tablePlayers,
    mySeat: seat,
    isMyTurn,
    isDefending,
    selectedCard,
    selectedKey,
    playableKeys,
    beatableIndexes,
    outcome,
    rejectedCode,
    canTake: isMyTurn && isDefending && hasUndefended,
    canPass: isMyTurn && !isDefending && (view?.table.length ?? 0) > 0 && !hasUndefended,
    selectCard,
    defendPair,
    take: () => play({ type: 'take' }),
    pass: () => play({ type: 'pass' }),
    transfer: (card: Card) => play({ type: 'transfer', card }),
  };
};
