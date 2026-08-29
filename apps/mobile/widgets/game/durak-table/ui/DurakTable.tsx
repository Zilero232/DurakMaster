import { createIdleView, useTableChatter } from '@/entities/game-table';
import { useOnlineGame, useSessionStore } from '@/entities/session';

import type { DurakTableProps } from './DurakTable.types';

import { isWaitingForPlayers } from '../lib';
import { useTableSounds } from '../model';
import { DurakTable as DurakPlayfield } from './components';

export const DurakTable = ({ settings, onLeave, onSelectPlayer }: DurakTableProps) => {
  const currentTable = useSessionStore((store) => store.currentTable);
  const tablePhrases = useSessionStore((store) => store.phrases);
  const tableEmojis = useSessionStore((store) => store.emojis);

  const game = useOnlineGame();
  const phrases = useTableChatter({ emojis: tableEmojis, phrases: tablePhrases, view: game.view });

  useTableSounds(game.view, game.isMyTurn);

  if (!currentTable || settings.game !== 'durak') {
    return null;
  }

  const view = game.view ?? createIdleView(currentTable, settings.rules);
  const isWaiting = isWaitingForPlayers(currentTable, game.view);

  return (
    <DurakPlayfield
      game={game}
      isWaiting={isWaiting}
      phrases={phrases}
      settings={settings}
      view={view}
      onLeave={onLeave}
      onSelectPlayer={onSelectPlayer}
    />
  );
};
