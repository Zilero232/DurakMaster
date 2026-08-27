import type { MyProfile } from '@durak-master/schemas';

import { httpClient } from '@/shared/api';

export const uploadAvatar = async (uri: string): Promise<MyProfile> => {
  const file = await fetch(uri);
  const body = await file.blob();

  const { data } = await httpClient.post<MyProfile>('/profile/avatar', body, {
    headers: { 'Content-Type': body.type || 'application/octet-stream' }
  });

  return data;
};
