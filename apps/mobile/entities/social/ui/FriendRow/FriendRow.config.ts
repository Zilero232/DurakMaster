import type { LucideIcon } from 'lucide-react-native';

import { Check, CheckCheck, Send, UserPlus, X } from 'lucide-react-native';

import type { FriendRowAction } from './FriendRow.types';

export const ICONS: Record<FriendRowAction, LucideIcon> = {
  add: UserPlus,
  accept: Check,
  invite: Send,
  invited: CheckCheck,

  decline: X,
  remove: X
};

export const PRIMARY: FriendRowAction[] = ['accept', 'add', 'invite'];

export const INERT: FriendRowAction[] = ['invited'];

export const AVATAR_SIZE = 40;

export const ACTION_HIT_SLOP = 4;
