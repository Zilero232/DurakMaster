import { useEffect } from 'react';

import { useSessionStore } from '@/entities/session';
import { useSession } from '@/shared/api';

export const useLobbyConnection = () => {
  const { data: session, isPending } = useSession();

  const status = useSessionStore((store) => store.status);
  const connect = useSessionStore((store) => store.connect);
  const subscribeLobby = useSessionStore((store) => store.subscribeLobby);
  const requestProfile = useSessionStore((store) => store.requestProfile);
  const profile = useSessionStore((store) => store.profile);

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

  useEffect(() => {
    if (status === 'connected' && !profile) {
      requestProfile();
    }
  }, [status, profile, requestProfile]);

  return { isPending, session, status };
};
