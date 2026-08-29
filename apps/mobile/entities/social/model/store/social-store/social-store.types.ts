import type { AchievementId, TableInvite } from '@durak-master/schemas';

export type SocialState = {
  invite: TableInvite | null;

  freshlyUnlocked: AchievementId[];
};

export type SocialActions = {
  inviteFriend: (userId: string) => void;

  setInvite: (invite: TableInvite | null) => void;
  setFreshlyUnlocked: (ids: AchievementId[]) => void;
  clearFreshlyUnlocked: () => void;

  reset: () => void;
};

export type SocialStore = SocialActions & SocialState;
