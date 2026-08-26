import { z } from 'zod';

import { MAX_NAME_LENGTH } from '../auth/credentials';
import { gameActionSchema, gameErrorCodeSchema, playerViewSchema } from '../game';
import { createTableInputSchema, joinTableInputSchema, lobbyTableSchema } from '../lobby/table';
import { avatarSeedSchema, myProfileSchema, publicProfileSchema } from '../profile/profile';
import { achievementIdSchema, achievementStateSchema } from '../social/achievements';
import { friendListSchema, tableInviteSchema } from '../social/friends';
import { leaderboardSchema } from '../social/leaderboard';
import { quickPhraseIdSchema } from './phrases';

export const clientMessageSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('lobby:subscribe') }),
  z.object({ type: z.literal('lobby:unsubscribe') }),

  z.object({ type: z.literal('table:create'), payload: createTableInputSchema }),
  z.object({ type: z.literal('table:join'), payload: joinTableInputSchema }),
  z.object({ type: z.literal('table:leave') }),
  z.object({ type: z.literal('table:ready'), payload: z.object({ isReady: z.boolean() }) }),

  z.object({ type: z.literal('table:add-bot') }),

  z.object({
    type: z.literal('profile:set-avatar'),
    payload: z.object({ seed: avatarSeedSchema })
  }),
  z.object({
    type: z.literal('profile:set-name'),
    payload: z.object({ name: z.string().trim().min(2).max(MAX_NAME_LENGTH) })
  }),

  z.object({ type: z.literal('friends:list') }),
  z.object({ type: z.literal('friends:search'), payload: z.object({ query: z.string() }) }),
  z.object({ type: z.literal('friends:request'), payload: z.object({ userId: z.string() }) }),
  z.object({ type: z.literal('friends:accept'), payload: z.object({ userId: z.string() }) }),
  z.object({ type: z.literal('friends:decline'), payload: z.object({ userId: z.string() }) }),
  z.object({ type: z.literal('friends:remove'), payload: z.object({ userId: z.string() }) }),
  z.object({ type: z.literal('friends:invite'), payload: z.object({ userId: z.string() }) }),

  z.object({ type: z.literal('achievements:list') }),
  z.object({ type: z.literal('leaderboard:list') }),
  z.object({
    type: z.literal('achievements:claim'),
    payload: z.object({ achievementId: achievementIdSchema })
  }),

  z.object({
    type: z.literal('game:action'),
    payload: z.object({
      action: gameActionSchema,
      expectedVersion: z.number().int().nonnegative()
    })
  }),

  z.object({
    type: z.literal('table:emoji'),
    payload: z.object({ emoji: z.string().min(1).max(8) })
  }),

  z.object({
    type: z.literal('table:phrase'),
    payload: z.object({ phraseId: quickPhraseIdSchema })
  }),

  z.object({ type: z.literal('profile:claim-bonus') }),

  z.object({ type: z.literal('ping') })
]);

export type ClientMessage = z.infer<typeof clientMessageSchema>;
export type ClientMessageType = ClientMessage['type'];

export const tablePhraseSchema = z.object({
  id: z.string(),
  userId: z.string(),
  phraseId: quickPhraseIdSchema,
  sentAt: z.number().int()
});

export type TablePhrase = z.infer<typeof tablePhraseSchema>;

export const serverMessageSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('connected'),
    payload: z.object({ profile: myProfileSchema })
  }),

  z.object({
    type: z.literal('profile:updated'),
    payload: z.object({ profile: myProfileSchema })
  }),

  z.object({
    type: z.literal('lobby:tables'),
    payload: z.object({ tables: z.array(lobbyTableSchema) })
  }),

  z.object({
    type: z.literal('lobby:table-updated'),
    payload: z.object({ table: lobbyTableSchema })
  }),

  z.object({
    type: z.literal('lobby:table-removed'),
    payload: z.object({ tableId: z.string() })
  }),

  z.object({
    type: z.literal('table:joined'),
    payload: z.object({ table: lobbyTableSchema, seat: z.number().int() })
  }),

  z.object({ type: z.literal('table:left') }),

  z.object({
    type: z.literal('game:state'),
    payload: z.object({
      view: playerViewSchema,
      players: z.array(publicProfileSchema)
    })
  }),

  z.object({
    type: z.literal('game:rejected'),
    payload: z.object({ code: gameErrorCodeSchema })
  }),

  z.object({
    type: z.literal('game:finished'),
    payload: z.object({
      loserUserId: z.string().nullable(),
      isDraw: z.boolean(),
      creditsDelta: z.number().int(),
      ratingDelta: z.number().int()
    })
  }),

  z.object({
    type: z.literal('table:emoji'),
    payload: z.object({ userId: z.string(), emoji: z.string() })
  }),

  z.object({
    type: z.literal('table:phrase'),
    payload: z.object({ phrase: tablePhraseSchema })
  }),

  z.object({
    type: z.literal('error'),
    payload: z.object({ message: z.string(), code: z.string().optional() })
  }),

  z.object({ type: z.literal('friends:list'), payload: friendListSchema }),
  z.object({
    type: z.literal('friends:found'),
    payload: z.object({ profiles: z.array(publicProfileSchema) })
  }),
  z.object({ type: z.literal('friends:invited'), payload: tableInviteSchema }),

  z.object({
    type: z.literal('achievements:list'),
    payload: z.object({ achievements: z.array(achievementStateSchema) })
  }),
  z.object({
    type: z.literal('achievements:unlocked'),
    payload: z.object({ ids: z.array(achievementIdSchema) })
  }),

  z.object({ type: z.literal('leaderboard:list'), payload: leaderboardSchema }),

  z.object({ type: z.literal('pong') })
]);

export type ServerMessage = z.infer<typeof serverMessageSchema>;
export type ServerMessageType = ServerMessage['type'];
