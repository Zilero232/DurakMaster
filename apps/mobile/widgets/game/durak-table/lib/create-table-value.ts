import { BOOSTS, PEEK_BOOSTS } from '@durak-master/schemas';
import { match, P } from 'ts-pattern';

import type { TableContextValue } from '../model/table-context.types';
import type { CreateTableValueInput } from './create-table-value.types';

import { pickPrimaryAction } from './pick-primary-action';
import { pickTurnStatus } from './pick-turn-status';

export const createTableValue = ({
  game,
  table,
  settings,
  phrases,
  isWaiting,
  onLeave
}: CreateTableValueInput): TableContextValue => {
  const { drag, profile, currentTable } = table;

  const isReady =
    currentTable?.players.find((player) => player.seat === game.mySeat)?.isReady ?? false;

  const seatCount = currentTable?.players.length ?? 0;

  const look = {
    hasHints: table.showHints,
    sortMode: table.handSort,
    isInstant: table.isInstant
  };

  const primaryAction = pickPrimaryAction({
    isWaiting,
    isReady,
    canAffordBet: (profile?.credits ?? 0) >= settings.bet,
    canTake: game.canTake,
    canPass: game.canPass,
    isTaking: game.view?.isTaking ?? false,
    isMainAttacker: game.view?.attackerSeat === game.mySeat
  });

  const runPrimaryAction = () =>
    match(primaryAction)
      .with('ready', () => table.setReady(true))
      .with('notReady', () => table.setReady(false))
      .with('leave', onLeave)
      .with('take', () => game.take())
      .with(P.union('done', 'pass'), () => game.pass())
      .with(null, () => {})
      .exhaustive();

  const seatNames = (game.view?.players ?? []).map((player) => ({
    seat: player.seat,
    name: game.players.find((member) => member.userId === player.userId)?.name ?? ''
  }));

  const turn = {
    isMyTurn: game.isMyTurn,
    isWaiting,
    isReady,
    hasFreeSeat: seatCount < settings.maxPlayers,
    primaryAction,
    status: pickTurnStatus({
      activeSeat: game.view?.activeSeat ?? null,
      defenderSeat: game.view?.defenderSeat ?? null,
      mySeat: game.mySeat,
      players: seatNames,
      isWaiting
    }),
    canUndo: game.canUndo,
    boosts: BOOSTS.filter(
      (boost) => settings.rules.fairness === 'cheaters' || !PEEK_BOOSTS.has(boost)
    ),
    turnSeconds: settings.turnTimeoutSeconds,
    playableKeys: game.playableKeys,
    selectedKey: game.selectedKey
  };

  const dragHandlers = {
    dropZones: drag.dropZones,
    onZonesChange: drag.setDropZones,
    onDropOn: drag.dropOn,
    onDropMiss: drag.dropMissed,
    onHover: drag.hover,
    onDragStart: drag.start,
    onDragEnd: drag.end
  };

  const moves = {
    onSelectCard: game.selectCard,
    onPrimaryAction: runPrimaryAction,
    onAddBot: table.addBot,
    onSendPhrase: table.sendPhrase,
    onSendEmoji: table.sendEmoji,
    onUseBoost: table.applyBoost
  };

  return {
    profile,
    chatter: profile ? phrases[profile.userId] : undefined,
    look,
    turn,
    drag: dragHandlers,
    moves
  };
};
