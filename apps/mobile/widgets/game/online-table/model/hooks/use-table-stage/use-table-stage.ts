import type { GameId, TableSettings } from '@durak-master/schemas';

import { useSessionStore } from '@/entities/session';

type TableStage =
  | { kind: 'absent' }
  | { kind: 'game'; game: Exclude<GameId, 'tysyacha'>; settings: TableSettings }
  | { kind: 'unsupported'; game: GameId };

const SUPPORTED = new Set<GameId>(['durak', 'kozel', 'burkozel']);

export const useTableStage = (): TableStage => {
  const currentTable = useSessionStore((store) => store.currentTable);

  if (!currentTable) {
    return { kind: 'absent' };
  }

  const { settings } = currentTable;

  if (!SUPPORTED.has(settings.game)) {
    return { kind: 'unsupported', game: settings.game };
  }

  return { kind: 'game', game: settings.game as Exclude<GameId, 'tysyacha'>, settings };
};
