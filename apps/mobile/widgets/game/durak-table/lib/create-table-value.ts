import { match, P } from 'ts-pattern';

import type { TableContextValue } from '../model/table-context.types';
import type { CreateTableValueInput } from './create-table-value.types';

import { pickPrimaryAction } from './pick-primary-action';

export const createTableValue = ({
  game,
  table,
  settings,
  phrases,
  isWaiting,
  onInviteFriends
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
    canTake: game.canTake,
    canPass: game.canPass,
    isTaking: game.view?.isTaking ?? false,
    isMainAttacker: game.view?.attackerSeat === game.mySeat
  });

  const runPrimaryAction = () =>
    match(primaryAction)
      .with('ready', () => table.setReady(true))
      .with('notReady', () => table.setReady(false))
      .with('take', () => game.take())
      .with(P.union('done', 'pass'), () => game.pass())
      .with(null, () => {})
      .exhaustive();

  const turn = {
    isMyTurn: game.isMyTurn,
    isWaiting,
    isReady,
    hasFreeSeat: seatCount < settings.maxPlayers,
    primaryAction,
    canUndo: game.canUndo,
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
    onInviteFriends,
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
