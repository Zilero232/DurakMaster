import { z } from 'zod';

import { cardSchema } from '../../core/card';

export const kozelActionSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('play'), card: cardSchema }),

  z.object({ type: z.literal('chooseLeader'), seat: z.number().int().nonnegative() }),
  z.object({ type: z.literal('exchangeLastTrump'), card: cardSchema })
]);

export type KozelAction = z.infer<typeof kozelActionSchema>;
