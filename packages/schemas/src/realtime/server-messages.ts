import { z } from 'zod';

import { boostIdSchema, cardSchema, gameErrorCodeSchema, playerViewSchema } from '../game';
import { lobbyTableSchema } from '../lobby/table';
import { myProfileSchema, publicProfileSchema } from '../profile/profile';
import { achievementIdSchema, achievementStateSchema } from '../social/achievements';
import { friendListSchema, tableInviteSchema } from '../social/friends';
import { leaderboardSchema } from '../social/leaderboard';
import { tablePhraseSchema } from './table-phrase';
import { tauntIdSchema } from './taunts';

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
    type: z.literal('table:boost-used'),
    payload: z.object({
      boost: boostIdSchema,
      coins: z.number().int().nonnegative(),
      talon: z.array(cardSchema).optional(),
      hand: z.array(cardSchema).optional(),
      targetUserId: z.string().optional()
    })
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
    payload: z.object({ userId: z.string(), emoji: tauntIdSchema })
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
