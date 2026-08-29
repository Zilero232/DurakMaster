import type { AvatarSeed, MyProfile } from '@durak-master/schemas';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  claimProfileBonus,
  fetchMyProfile,
  PROFILE_QUERY_KEY,
  setProfileAvatar,
  setProfileName
} from './profile-api';

export const useMyProfile = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: fetchMyProfile,
    staleTime: 30_000
  });

  const write = (profile: MyProfile) => queryClient.setQueryData(PROFILE_QUERY_KEY, profile);

  const rename = useMutation({ mutationFn: setProfileName, onSuccess: write });
  const changeAvatar = useMutation({ mutationFn: setProfileAvatar, onSuccess: write });
  const claimBonus = useMutation({ mutationFn: claimProfileBonus, onSuccess: write });

  return {
    profile: query.data ?? null,
    isPending: query.isPending,

    setName: (name: string) => rename.mutate(name),
    setAvatar: (seed: AvatarSeed) => changeAvatar.mutate(seed),
    claimBonus: () => claimBonus.mutate(),

    writeProfile: write
  };
};
