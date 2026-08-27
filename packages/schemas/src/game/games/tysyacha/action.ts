import { z } from 'zod';

import { cardSchema, suitSchema } from '../../core/card';

export const tysyachaActionSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('bid'), value: z.number().int().positive() }),
  z.object({ type: z.literal('pass') }),
  z.object({
    type: z.literal('discard'),
    cards: z.array(cardSchema).length(2),
    gifts: z.array(z.object({ seat: z.number().int().nonnegative(), card: cardSchema }))
  }),
  z.object({ type: z.literal('play'), card: cardSchema }),
  z.object({ type: z.literal('declareMarriage'), suit: suitSchema, card: cardSchema }),
  z.object({ type: z.literal('concede') })
]);

export type TysyachaAction = z.infer<typeof tysyachaActionSchema>;
