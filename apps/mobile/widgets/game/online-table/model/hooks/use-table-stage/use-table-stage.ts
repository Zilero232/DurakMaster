import type { GameId, TableSettings, ViewForGame } from '@durak-master/schemas';

import { useSessionStore } from '@/entities/session';

type TableStage =
  | { kind: 'absent' }
  | { kind: 'playing'; settings: TableSettings; view: ViewForGame<'durak'> }
  | { kind: 'unsupported'; game: GameId }
  | { kind: 'waiting' };

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
    return { kind: 'waiting' };
  }

  return { kind: 'playing', settings, view };
};
