import { useSessionStore } from '@/entities/session';

import type { TableStage } from './use-table-stage.types';

import { SUPPORTED_GAMES } from './use-table-stage.config';

export const useTableStage = (): TableStage => {
  const currentTable = useSessionStore((store) => store.currentTable);

  if (!currentTable) {
    return { kind: 'absent' };
  }

  const { settings } = currentTable;

  if (!SUPPORTED_GAMES.has(settings.game)) {
    return { kind: 'unsupported', game: settings.game };
  }

  return { kind: 'game', game: settings.game, settings };
};
