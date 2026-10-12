import { useEffect, useState } from 'react';

import { useSessionStore } from '@/entities/session';

import { REFRESH_TIMEOUT_MS } from '../../../config';

export const useLobbyRefresh = () => {
  const status = useSessionStore((store) => store.status);
  const tables = useSessionStore((store) => store.tables);
  const connect = useSessionStore((store) => store.connect);
  const subscribeLobby = useSessionStore((store) => store.subscribeLobby);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [seenTables, setSeenTables] = useState(tables);

  if (seenTables !== tables) {
    setSeenTables(tables);
    setIsRefreshing(false);
  }

  useEffect(() => {
    if (!isRefreshing) {
      return;
    }

    const timer = setTimeout(setIsRefreshing, REFRESH_TIMEOUT_MS, false);

    return () => clearTimeout(timer);
  }, [isRefreshing]);

  const refresh = () => {
    setIsRefreshing(true);

    if (status === 'connected') {
      subscribeLobby();
    } else {
      connect();
    }
  };

  return { isRefreshing, refresh };
};
