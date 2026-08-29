import type { AvatarSeed, MyProfile } from '@durak-master/schemas';

import { httpClient } from '@/shared/api';

export const PROFILE_QUERY_KEY = ['profile', 'me'] as const;

export const fetchMyProfile = async (): Promise<MyProfile> => {
  const { data } = await httpClient.get<MyProfile>('/profile/me');

  return data;
};

export const setProfileName = async (name: string): Promise<MyProfile> => {
  const { data } = await httpClient.patch<MyProfile>('/profile/me/name', { name });

  return data;
};

export const setProfileAvatar = async (seed: AvatarSeed): Promise<MyProfile> => {
  const { data } = await httpClient.patch<MyProfile>('/profile/me/avatar', { seed });

  return data;
};

export const claimProfileBonus = async (): Promise<MyProfile> => {
  const { data } = await httpClient.post<MyProfile>('/profile/bonus');

  return data;
};
