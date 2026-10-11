import type { AchievementId, TableInvite } from '@durak-master/schemas';

export type InviteTarget = {
  userId: string;
  tableId: string;
};

export type SocialState = {
  invite: TableInvite | null;

  /** When each friend was last invited, keyed by `tableId:userId`. */
  sentInvites: Record<string, number>;
  lastInvite: InviteTarget | null;

  freshlyUnlocked: AchievementId[];
};

export type SocialActions = {
  inviteFriend: (target: InviteTarget) => void;
  forgetLastInvite: () => void;

  setInvite: (invite: TableInvite | null) => void;
  setFreshlyUnlocked: (ids: AchievementId[]) => void;
  clearFreshlyUnlocked: () => void;

  reset: () => void;
};

export type SocialStore = SocialActions & SocialState;
