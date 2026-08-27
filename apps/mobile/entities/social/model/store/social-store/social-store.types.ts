import type {
  AchievementId,
  AchievementState,
  FriendList,
  Leaderboard,
  PublicProfile,
  TableInvite
} from '@durak-master/schemas';

export type SocialState = {
  friends: FriendList;

  found: PublicProfile[];
  achievements: AchievementState[];
  leaderboard: Leaderboard;

  invite: TableInvite | null;

  freshlyUnlocked: AchievementId[];

  hasLoaded: boolean;
};

export type SocialActions = {
  loadFriends: () => void;
  searchFriends: (query: string) => void;
  clearSearch: () => void;
  requestFriend: (userId: string) => void;
  acceptFriend: (userId: string) => void;
  declineFriend: (userId: string) => void;
  removeFriend: (userId: string) => void;
  inviteFriend: (userId: string) => void;

  loadAchievements: () => void;
  loadLeaderboard: () => void;
  claimAchievement: (achievementId: AchievementId) => void;

  setFriends: (friends: FriendList) => void;
  setFound: (found: PublicProfile[]) => void;
  setAchievements: (achievements: AchievementState[]) => void;
  setLeaderboard: (leaderboard: Leaderboard) => void;
  setInvite: (invite: TableInvite | null) => void;
  setFreshlyUnlocked: (ids: AchievementId[]) => void;
  clearFreshlyUnlocked: () => void;

  reset: () => void;
};

export type SocialStore = SocialActions & SocialState;
