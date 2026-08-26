import { z } from 'zod';

import { gameActionSchema, gameErrorCodeSchema } from '../game/action';
import { playerViewSchema } from '../game/state';
import { createTableInputSchema, joinTableInputSchema, lobbyTableSchema } from '../lobby/table';
import { myProfileSchema, publicProfileSchema } from '../profile/profile';
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

  z.object({ type: z.literal('pong') })
]);

export type ServerMessage = z.infer<typeof serverMessageSchema>;
export type ServerMessageType = ServerMessage['type'];
