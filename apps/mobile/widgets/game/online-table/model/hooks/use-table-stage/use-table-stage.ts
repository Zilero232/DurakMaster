import type { GameId, TableSettings, ViewForGame } from '@durak-master/schemas';

import { useSessionStore } from '@/entities/session';

import { createIdleView } from '../../../lib';

type TableStage =
  | { kind: 'absent' }
  | { kind: 'table'; settings: TableSettings; view: ViewForGame<'durak'>; isWaiting: boolean }
  | { kind: 'unsupported'; game: GameId };

export const useTableStage = (view: ViewForGame<'durak'> | null): TableStage => {
  const currentTable = useSessionStore((store) => store.currentTable);

  if (!currentTable) {
    return { kind: 'absent' };
  }

  const { settings } = currentTable;

  if (settings.game !== 'durak') {
    return { kind: 'unsupported', game: settings.game };
  }

  if (!view) {
    return {
      kind: 'table',
      settings,
      view: createIdleView(currentTable, settings.rules),
      isWaiting: true
    };
  }

  const isWaiting = currentTable.status === 'waiting' && view.phase === 'waiting';

  return { kind: 'table', settings, view, isWaiting };
};
