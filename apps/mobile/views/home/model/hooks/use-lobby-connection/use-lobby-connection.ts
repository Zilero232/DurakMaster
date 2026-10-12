import { useEffect } from 'react';

import { useSessionStore } from '@/entities/session';
import { useSession } from '@/shared/api';

export const useLobbyConnection = () => {
  const status = useSessionStore((store) => store.status);
  const connect = useSessionStore((store) => store.connect);
  const disconnect = useSessionStore((store) => store.disconnect);
  const setSigningOut = useSessionStore((store) => store.setSigningOut);
  const subscribeLobby = useSessionStore((store) => store.subscribeLobby);

  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (!session) {
      setSigningOut(false);

      if (status !== 'idle') {
        disconnect();
      }

      return;
    }

    if (status === 'idle' || status === 'error') {
      connect();
    }
  }, [session, status, connect, disconnect, setSigningOut]);

  useEffect(() => {
    if (status === 'connected') {
      subscribeLobby();
    }
  }, [status, subscribeLobby]);

  return { isPending, session, status };
};
