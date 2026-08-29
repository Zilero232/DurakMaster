import type { AchievementId } from '@durak-master/schemas';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { ACHIEVEMENTS_QUERY_KEY, claimAchievement, fetchAchievements } from './social-api';

export const useAchievements = () => {
  const queryClient = useQueryClient();

  const query = useQuery({ queryKey: ACHIEVEMENTS_QUERY_KEY, queryFn: fetchAchievements });

  const claim = useMutation({
    mutationFn: claimAchievement,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ACHIEVEMENTS_QUERY_KEY })
  });

  return {
    achievements: query.data ?? [],
    isPending: query.isPending,

    claim: (achievementId: AchievementId) => claim.mutate(achievementId)
  };
};
