import type {
  AchievementId,
  AchievementState,
  FriendList,
  Leaderboard,
  PublicProfile
} from '@durak-master/schemas';

import { httpClient } from '@/shared/api';

export const FRIENDS_QUERY_KEY = ['friends'] as const;
export const ACHIEVEMENTS_QUERY_KEY = ['achievements'] as const;
export const LEADERBOARD_QUERY_KEY = ['leaderboard'] as const;

export const fetchFriends = async (): Promise<FriendList> => {
  const { data } = await httpClient.get<FriendList>('/friends');

  return data;
};

export const searchProfiles = async (query: string): Promise<PublicProfile[]> => {
  const { data } = await httpClient.get<PublicProfile[]>('/friends/search', { params: { query } });

  return data;
};

export const requestFriend = (userId: string) => httpClient.post(`/friends/${userId}/request`);

export const acceptFriend = (userId: string) => httpClient.post(`/friends/${userId}/accept`);

export const declineFriend = (userId: string) => httpClient.post(`/friends/${userId}/decline`);

export const removeFriend = (userId: string) => httpClient.delete(`/friends/${userId}`);

export const fetchAchievements = async (): Promise<AchievementState[]> => {
  const { data } = await httpClient.get<AchievementState[]>('/achievements');

  return data;
};

export const claimAchievement = async (
  achievementId: AchievementId
): Promise<{ coins: number }> => {
  const { data } = await httpClient.post<{ coins: number }>('/achievements/claim', {
    achievementId
  });

  return data;
};

export const fetchLeaderboard = async (): Promise<Leaderboard> => {
  const { data } = await httpClient.get<Leaderboard>('/leaderboard');

  return data;
};
