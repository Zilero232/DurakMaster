import { z } from 'zod';

import { cardSchema } from '../card';
import { BURKOZEL_HAND_SIZE } from './state';

export const burkozelCombinationSchema = z.enum(['moscow', 'molodka']);

export type BurkozelCombination = z.infer<typeof burkozelCombinationSchema>;

export const burkozelActionSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('play'),
    cards: z.array(cardSchema).min(1).max(BURKOZEL_HAND_SIZE)
  }),
  z.object({
    type: z.literal('declare'),
    combination: burkozelCombinationSchema
  })
]);

export type BurkozelAction = z.infer<typeof burkozelActionSchema>;
