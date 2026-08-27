import type { ActionForGame, Card } from '@durak-master/schemas';

import { cardKey } from '@/shared/lib/cards';
import { getBeatableIndexes, getPlayableKeys } from '@/shared/lib/games/durak';
import { haptic } from '@/shared/lib/haptics';
import { playSound } from '@/shared/lib/sound';

import { sendGameAction, useSessionStore } from './session-store';

export const useOnlineGame = () => {
  const rawView = useSessionStore((store) => store.view);
  const profile = useSessionStore((store) => store.profile);
  const tablePlayers = useSessionStore((store) => store.tablePlayers);
  const mySeat = useSessionStore((store) => store.mySeat);
  const outcome = useSessionStore((store) => store.outcome);
  const rejectedCode = useSessionStore((store) => store.rejectedCode);
  const selectedKey = useSessionStore((store) => store.selectedTableCardKey);
  const setSelectedKey = useSessionStore((store) => store.selectTableCard);

  const view = rawView?.game === 'durak' ? rawView : null;

  const seat = mySeat ?? 0;
  const isMyTurn = Boolean(view) && view?.activeSeat === seat && view?.phase !== 'finished';
  const isDefending = view?.defenderSeat === seat;

  const selectedCard = view?.hand.find((card) => cardKey(card) === selectedKey) ?? null;
  const playableKeys = getPlayableKeys(view, isMyTurn, isDefending);
  const beatableIndexes =
    isDefending && isMyTurn ? getBeatableIndexes(view, selectedCard) : new Set<number>();

  const hasUndefended = view?.table.some((pair) => pair.defense === null) ?? false;

  const play = (action: ActionForGame<'durak'>['action']) => {
    if (!view) {
      return;
    }

    sendGameAction({ game: 'durak', action }, view.version);
  };

  const selectCard = (card: Card) => {
    const key = cardKey(card);

    if (isDefending) {
      playSound('click');
      haptic('tap');
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

  const defendPairWith = (pairIndex: number, card: Card) => {
    play({ type: 'defend', pairIndex, card });
    setSelectedKey(null);
  };

  const attackWith = (card: Card) => {
    play({ type: 'attack', card });
    setSelectedKey(null);
  };

  const beatableWith = (card: Card): Set<number> => getBeatableIndexes(view, card);

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
    attackWith,
    defendPair,
    defendPairWith,
    beatableWith,

    take: () => play({ type: 'take' }),

    pass: () => play({ type: 'pass' }),

    transfer: (card: Card) => play({ type: 'transfer', card })
  };
};

export type OnlineGame = ReturnType<typeof useOnlineGame>;
