import { useState } from 'react';

import { useSessionStore } from '@/entities/session';

export const useTableJoin = () => {
  const tables = useSessionStore((store) => store.tables);
  const joinTable = useSessionStore((store) => store.joinTable);

  const [passwordTableId, setPasswordTableId] = useState<string | null>(null);

  const join = (tableId: string) => {
    const table = tables.find((item) => item.id === tableId);

    if (table?.settings.isPrivate) {
      setPasswordTableId(tableId);

      return;
    }

    joinTable(tableId);
  };

  const confirmPassword = (password: string) => {
    if (passwordTableId) {
      joinTable(passwordTableId, password);
    }
  };

  const cancelPassword = () => {
    setPasswordTableId(null);
  };

  return {
    isPasswordPromptOpen: passwordTableId !== null,
    join,
    confirmPassword,
    cancelPassword
  };
};
