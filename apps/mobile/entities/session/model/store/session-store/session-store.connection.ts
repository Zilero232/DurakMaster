import type { ServerMessage } from '@durak-master/schemas';

import { socketClient } from '@/shared/api';

import type { ConnectionStatus } from './session-store.types';

type SocketListeners = {
  onMessage: (message: ServerMessage) => void;
  onStatus: (status: ConnectionStatus) => void;
  onDisconnected: () => void;
};

export const listenToSocket = ({ onMessage, onStatus, onDisconnected }: SocketListeners) => {
  socketClient.subscribe(onMessage);

  socketClient.subscribeState((state) => {
    if (state === 'closed') {
      onStatus('error');
      onDisconnected();

      return;
    }

    onStatus(state === 'open' ? 'connected' : 'connecting');
  });
};
