import { socketClient } from '@/shared/api';

import { useSocialStore } from './social-store';

export const subscribeToSocialMessages = () =>
  socketClient.subscribe((message) => {
    const store = useSocialStore.getState();

    switch (message.type) {
      case 'friends:list':
        store.setFriends(message.payload);
        break;

      case 'friends:found':
        store.setFound(message.payload.profiles);
        break;

      case 'friends:invited':
        store.setInvite(message.payload);
        break;

      case 'achievements:list':
        store.setAchievements(message.payload.achievements);
        break;

      case 'leaderboard:list':
        store.setLeaderboard(message.payload);
        break;

      case 'achievements:unlocked':
        store.setFreshlyUnlocked(message.payload.ids);
        break;

      default:
        break;
    }
  });

subscribeToSocialMessages();
