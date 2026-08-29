import type { Leaderboard } from '@durak-master/schemas';

import { useQuery } from '@tanstack/react-query';

import { fetchLeaderboard, LEADERBOARD_QUERY_KEY } from './social-api';

const EMPTY_LEADERBOARD: Leaderboard = { entries: [], myRank: null };

export const useLeaderboard = () => {
  const query = useQuery({ queryKey: LEADERBOARD_QUERY_KEY, queryFn: fetchLeaderboard });

  return {
    leaderboard: query.data ?? EMPTY_LEADERBOARD,
    isPending: query.isPending
  };
};
