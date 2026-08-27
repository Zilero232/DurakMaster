import type { ServerMessage } from '@durak-master/schemas';

import { getAuthToken, socketClient } from '@/shared/api';
import { WS_URL } from '@/shared/config';

import type { ConnectionStatus } from './session-store.types';

type ConnectionHandlers = {
  onMessage: (message: ServerMessage) => void;
  onStatus: (status: ConnectionStatus) => void;
  getStatus: () => ConnectionStatus;
  isLobbySubscribed: () => boolean;
};

export const createConnection = ({
  onMessage,
  onStatus,
  getStatus,
  isLobbySubscribed
}: ConnectionHandlers) => {
  let unsubscribeMessages: (() => void) | null = null;
  let unsubscribeState: (() => void) | null = null;

  const open = async () => {
    unsubscribeMessages?.();
    unsubscribeMessages = socketClient.subscribe(onMessage);

    unsubscribeState?.();
    unsubscribeState = socketClient.subscribeState((state) => {
      if (state === 'closed') {
        onStatus('error');

        return;
      }

      if (state === 'connecting') {
        onStatus('connecting');

        return;
      }

      onStatus('connected');

      if (isLobbySubscribed()) {
        socketClient.send({ type: 'lobby:subscribe' });
      }
    });

    const token = await getAuthToken();

    if (getStatus() !== 'connecting') {
      return;
    }

    socketClient.connect(token ? `${WS_URL}?token=${encodeURIComponent(token)}` : WS_URL);
  };

  const close = () => {
    unsubscribeMessages?.();
    unsubscribeMessages = null;
    unsubscribeState?.();
    unsubscribeState = null;

    socketClient.disconnect();
  };

  return { open, close };
};
