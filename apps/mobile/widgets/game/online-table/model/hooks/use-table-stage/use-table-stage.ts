import { useSessionStore } from '@/entities/session';

import type { TableStage } from './use-table-stage.types';

export const useTableStage = (): TableStage => {
  const currentTable = useSessionStore((store) => store.currentTable);

  if (!currentTable) {
    return { kind: 'absent' };
  }

  const { settings } = currentTable;

  return { kind: 'game', game: settings.game, settings };
};
