import type { SocialState } from './social-store.types';

export const INITIAL_STATE: SocialState = {
  invite: null,
  sentInvites: {},
  lastInvite: null,
  freshlyUnlocked: []
};

export const UNREACHABLE_INVITE_CODES = new Set(['FRIEND_OFFLINE', 'NOT_FRIENDS']);
