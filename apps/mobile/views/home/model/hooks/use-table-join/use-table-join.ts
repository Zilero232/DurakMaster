import { useState } from 'react';

import { useSessionStore } from '@/entities/session';

export const useTableJoin = () => {
  const tables = useSessionStore((store) => store.tables);
  const joinTable = useSessionStore((store) => store.joinTable);

  const [pendingTableId, setPendingTableId] = useState<string | null>(null);

  const join = (tableId: string) => {
    const table = tables.find((item) => item.id === tableId);

    if (table?.settings.isPrivate) {
      setPendingTableId(tableId);

      return;
    }

    joinTable(tableId);
  };

  const confirmPassword = (password: string) => {
    if (pendingTableId) {
      joinTable(pendingTableId, password);
      setPendingTableId(null);
    }
  };

  const cancelPassword = () => {
    setPendingTableId(null);
  };

  return {
    isPasswordPromptOpen: pendingTableId !== null,
    join,
    confirmPassword,
    cancelPassword
  };
};
