import { createIdleView, useTableChatter } from '@/entities/game-table';
import { useOnlineGame, useSessionStore } from '@/entities/session';

import type { DurakTableProps } from './DurakTable.types';

import { useTableSounds } from '../model';
import { DurakTable as DurakPlayfield } from './components';

export const DurakTable = ({ settings, onLeave, onSelectPlayer }: DurakTableProps) => {
  const currentTable = useSessionStore((store) => store.currentTable);

  const game = useOnlineGame();
  const phrases = useTableChatter();

  useTableSounds(game.view, game.isMyTurn);

  if (!currentTable || settings.game !== 'durak') {
    return null;
  }

  const view = game.view ?? createIdleView(currentTable, settings.rules);
  const isWaiting = !game.view || (currentTable.status === 'waiting' && view.phase === 'waiting');

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
