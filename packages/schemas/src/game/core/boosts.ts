import { z } from 'zod';

export const BOOSTS = ['undoMove', 'peekTalon', 'peekHand'] as const;

export const boostIdSchema = z.enum(BOOSTS);

export type BoostId = z.infer<typeof boostIdSchema>;

export const BOOST_PRICE: Record<BoostId, number> = {
  undoMove: 1,
  peekTalon: 3,
  peekHand: 2
};

export const useBoostInputSchema = z.object({
  boost: boostIdSchema,

  targetUserId: z.string().optional()
});

export type UseBoostInput = z.infer<typeof useBoostInputSchema>;
