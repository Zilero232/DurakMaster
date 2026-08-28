import { z } from 'zod';

import { MAX_NAME_LENGTH } from '../auth/credentials';
import { gameActionSchema, useBoostInputSchema } from '../game';
import { createTableInputSchema, joinTableInputSchema } from '../lobby/table';
import { avatarSeedSchema } from '../profile/profile';
import { achievementIdSchema } from '../social/achievements';
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

  z.object({
    type: z.literal('profile:set-avatar'),
    payload: z.object({ seed: avatarSeedSchema })
  }),
  z.object({
    type: z.literal('profile:set-name'),
    payload: z.object({ name: z.string().trim().min(2).max(MAX_NAME_LENGTH) })
  }),

  z.object({ type: z.literal('profile:get') }),

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
    payload: z.object({ emoji: tauntIdSchema })
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
