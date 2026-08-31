import type { ServerMessage } from '@durak-master/schemas';

import { getAuthToken, socketClient } from '@/shared/api';
import { WS_URL } from '@/shared/config';

import type { ConnectionStatus } from './session-store.types';

type ConnectionHandlers = {
  onMessage: (message: ServerMessage) => void;
  onStatus: (status: ConnectionStatus) => void;
  onDisconnected: () => void;
  getStatus: () => ConnectionStatus;
  isLobbySubscribed: () => boolean;
};

export const createConnection = ({
  onMessage,
  onStatus,
  onDisconnected,
  getStatus,
  isLobbySubscribed
}: ConnectionHandlers) => {
  socketClient.subscribe(onMessage);

  socketClient.subscribeState((state) => {
    if (state === 'closed') {
      onStatus('error');
      onDisconnected();

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

  const open = async () => {
    const token = await getAuthToken();

    if (getStatus() !== 'connecting') {
      return;
    }

    socketClient.connect(token ? `${WS_URL}?token=${encodeURIComponent(token)}` : WS_URL);
  };

  const close = () => {
    socketClient.disconnect();
  };

  return { open, close };
};
