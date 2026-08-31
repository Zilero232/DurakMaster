import { Check, Send, UserPlus, X } from 'lucide-react-native';

import type { FriendRowAction } from './FriendRow.types';

export const ICONS = {
  add: UserPlus,
  accept: Check,
  invite: Send,

  decline: X,
  remove: X
} as const;

export const PRIMARY: FriendRowAction[] = ['accept', 'add', 'invite'];

export const AVATAR_SIZE = 40;
