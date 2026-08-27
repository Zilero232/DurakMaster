import type { TableContextValue } from '../model/table-context.types';
import type { CreateTableValueInput } from './create-table-value.types';

export const createTableValue = ({
  game,
  table,
  settings,
  phrases,
  isWaiting
}: CreateTableValueInput): TableContextValue => {
  const { drag, profile, currentTable } = table;

  const isReady =
    currentTable?.players.find((player) => player.seat === game.mySeat)?.isReady ?? false;

  const seatCount = currentTable?.players.length ?? 0;

  const look = {
    hasHints: table.showHints,
    sortMode: table.handSort,
    cardScale: table.cardScale,
    isInstant: table.isInstant
  };

  const turn = {
    isMyTurn: game.isMyTurn,
    isWaiting,
    isReady,
    isLoser: game.outcome?.loserUserId === profile?.userId,
    hasFreeSeat: seatCount < settings.maxPlayers,
    canPass: game.canPass,
    canTake: game.canTake,
    turnSeconds: settings.turnTimeoutSeconds,
    playableKeys: game.playableKeys,
    selectedKey: game.selectedKey
  };

  const dragHandlers = {
    dropZones: drag.dropZones,
    onDropOn: drag.dropOn,
    onDropMiss: drag.dropMissed,
    onHover: drag.hover,
    onDragStart: drag.start,
    onDragEnd: drag.end
  };

  const moves = {
    onSelectCard: game.selectCard,
    onPass: game.pass,
    onTake: game.take,
    onReady: table.setReady,
    onAddBot: table.addBot,
    onSendPhrase: table.sendPhrase,
    onSendEmoji: table.sendEmoji,
    onUseBoost: table.handleBoost
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
