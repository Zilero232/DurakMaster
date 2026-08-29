import type { MyProfile, ServerMessage } from '@durak-master/schemas';

import { queryClient } from '@/shared/api';

import { PROFILE_QUERY_KEY } from '../../../api';

export const cacheProfileFrom = (message: ServerMessage): void => {
  if (message.type === 'connected' || message.type === 'profile:updated') {
    queryClient.setQueryData(PROFILE_QUERY_KEY, message.payload.profile);

    return;
  }

  if (message.type === 'table:boost-used') {
    const { coins } = message.payload;

    queryClient.setQueryData<MyProfile>(PROFILE_QUERY_KEY, (current) =>
      current ? { ...current, coins } : current
    );
  }
};
