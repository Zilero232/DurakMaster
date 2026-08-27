import { z } from 'zod';

import { cardSchema, suitSchema } from '../../core/card';
import { gameCoreStateSchema } from '../../core/player';
import { durakRulesSchema } from './rules';

export const tablePairSchema = z.object({
  attack: cardSchema,
  defense: cardSchema.nullable(),

  /** Seat that threw the attack in. Anyone may throw in, not just the attacker. */
  attackSeat: z.number().int().nonnegative(),
  /** Seat that beat it, once someone has. */
  defenseSeat: z.number().int().nonnegative().nullable()
});

export type TablePair = z.infer<typeof tablePairSchema>;

export const durakStateSchema = gameCoreStateSchema.extend({
  game: z.literal('durak'),
  rules: durakRulesSchema,

  hands: z.record(z.string(), z.array(cardSchema)),
  talon: z.array(cardSchema),
  trump: suitSchema,
  trumpCard: cardSchema.nullable(),

  table: z.array(tablePairSchema),
  discard: z.array(cardSchema),

  attackerSeat: z.number().int().nonnegative(),
  defenderSeat: z.number().int().nonnegative(),

  attackLimit: z.number().int().positive(),
  passedSeats: z.array(z.number().int().nonnegative()),
  shownTrumpSeats: z.array(z.number().int().nonnegative()),

  isTaking: z.boolean(),

  loserUserId: z.string().nullable(),
  isDraw: z.boolean()
});

export type DurakState = z.infer<typeof durakStateSchema>;

export const durakViewSchema = durakStateSchema
  .omit({ hands: true, talon: true, discard: true })
  .extend({
    hand: z.array(cardSchema),
    talonCount: z.number().int().nonnegative(),
    discardCount: z.number().int().nonnegative()
  });

export type DurakView = z.infer<typeof durakViewSchema>;
