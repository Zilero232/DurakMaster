import { queryClient, socketClient } from '@/shared/api';

import { ACHIEVEMENTS_QUERY_KEY } from '../../../api';
import { useSocialStore } from './social-store';
import { UNREACHABLE_INVITE_CODES } from './social-store.config';

export const subscribeToSocialMessages = () =>
  socketClient.subscribe((message) => {
    const store = useSocialStore.getState();

    if (message.type === 'friends:invited') {
      store.setInvite(message.payload);

      return;
    }

    if (message.type === 'error' && UNREACHABLE_INVITE_CODES.has(message.payload.code ?? '')) {
      store.forgetLastInvite();

      return;
    }

    if (message.type === 'achievements:unlocked') {
      store.setFreshlyUnlocked(message.payload.ids);

      void queryClient.invalidateQueries({ queryKey: ACHIEVEMENTS_QUERY_KEY });
    }
  });

subscribeToSocialMessages();
