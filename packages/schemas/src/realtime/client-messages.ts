import { z } from 'zod';

import { gameActionSchema, useBoostInputSchema } from '../game';
import { createTableInputSchema, joinTableInputSchema } from '../lobby/table';
import { quickPhraseIdSchema } from './phrases';
import { tauntIdSchema } from './taunts';

export const clientMessageSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('lobby:subscribe') }),
  z.object({ type: z.literal('lobby:unsubscribe') }),

  z.object({ type: z.literal('table:create'), payload: createTableInputSchema }),
  z.object({ type: z.literal('table:join'), payload: joinTableInputSchema }),
  z.object({ type: z.literal('table:leave') }),
  z.object({ type: z.literal('table:ready'), payload: z.object({ isReady: z.boolean() }) }),

  z.object({ type: z.literal('table:add-bot') }),
  z.object({ type: z.literal('table:boost'), payload: useBoostInputSchema }),

  z.object({ type: z.literal('friends:invite'), payload: z.object({ userId: z.string() }) }),

  z.object({
    type: z.literal('game:action'),
    payload: z.object({
      action: gameActionSchema,
      expectedVersion: z.number().int().nonnegative()
    })
  }),

  z.object({
    type: z.literal('table:emoji'),
    payload: z.object({ emoji: tauntIdSchema })
  }),

  z.object({
    type: z.literal('table:phrase'),
    payload: z.object({ phraseId: quickPhraseIdSchema })
  }),

  z.object({ type: z.literal('ping') })
]);

export type ClientMessage = z.infer<typeof clientMessageSchema>;
export type ClientMessageType = ClientMessage['type'];
