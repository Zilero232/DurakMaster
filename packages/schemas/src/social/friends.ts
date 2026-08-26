import { z } from 'zod';

import { publicProfileSchema } from '../profile/profile';

export const friendshipStatusSchema = z.enum(['pending', 'accepted', 'declined', 'blocked']);

export type FriendshipStatus = z.infer<typeof friendshipStatusSchema>;

export const friendSchema = z.object({
  profile: publicProfileSchema,
  status: friendshipStatusSchema,

  isOutgoing: z.boolean(),

  tableId: z.string().nullable(),
  since: z.number().int().nullable()
});

export type Friend = z.infer<typeof friendSchema>;

export const friendListSchema = z.object({
  friends: z.array(friendSchema),
  incoming: z.array(friendSchema),
  outgoing: z.array(friendSchema)
});

export type FriendList = z.infer<typeof friendListSchema>;

export const tableInviteSchema = z.object({
  id: z.string(),
  from: publicProfileSchema,
  tableId: z.string(),
  expiresAt: z.number().int()
});

export type TableInvite = z.infer<typeof tableInviteSchema>;

export const MAX_FRIENDS = 200;

export const INVITE_TTL_MS = 2 * 60 * 1000;
