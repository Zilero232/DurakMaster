import { z } from 'zod';

import { cardSchema } from '../../core/card';

export const durakActionSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('attack'), card: cardSchema }),
  z.object({
    type: z.literal('defend'),
    pairIndex: z.number().int().nonnegative(),
    card: cardSchema
  }),
  z.object({ type: z.literal('transfer'), card: cardSchema }),
  z.object({ type: z.literal('transferByShowing'), card: cardSchema }),
  z.object({ type: z.literal('take') }),
  z.object({ type: z.literal('pass') })
]);

export type DurakAction = z.infer<typeof durakActionSchema>;
