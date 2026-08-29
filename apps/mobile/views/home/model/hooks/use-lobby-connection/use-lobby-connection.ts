import { useEffect } from 'react';

import { useSessionStore } from '@/entities/session';
import { useSession } from '@/shared/api';

export const useLobbyConnection = () => {
  const { data: session, isPending } = useSession();

  const status = useSessionStore((store) => store.status);
  const connect = useSessionStore((store) => store.connect);
  const subscribeLobby = useSessionStore((store) => store.subscribeLobby);

  useEffect(() => {
    if (session && (status === 'idle' || status === 'error')) {
      void connect();
    }
  }, [session, status, connect]);

  useEffect(() => {
    if (status === 'connected') {
      subscribeLobby();
    }
  }, [status, subscribeLobby]);

  return { isPending, session, status };
};
