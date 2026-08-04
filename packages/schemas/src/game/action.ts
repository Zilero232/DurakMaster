import { z } from 'zod';

import { cardSchema } from './card';

/**
 * Действия игрока. Дискриминированное объединение по `type` — сервер
 * валидирует каждое действие против состояния перед применением.
 *
 * Клиент НИКОГДА не решает исход: он лишь заявляет намерение.
 */
export const gameActionSchema = z.discriminatedUnion('type', [
  /** Первая карта отбоя либо подкидывание. */
  z.object({
    type: z.literal('attack'),
    card: cardSchema,
  }),

  /** Отбить конкретную атакующую карту. */
  z.object({
    type: z.literal('defend'),
    /** Индекс пары в `state.table`, которую отбиваем. */
    pairIndex: z.number().int().nonnegative(),
    card: cardSchema,
  }),

  /** Перевести атаку следующему игроку (только режим `transfer`). */
  z.object({
    type: z.literal('transfer'),
    card: cardSchema,
  }),

  /**
   * Перевод показом козыря — карта остаётся в руке.
   * Только при `allowTransferByShowingTrump`.
   */
  z.object({
    type: z.literal('transferByShowing'),
    card: cardSchema,
  }),

  /** «Беру» — защищающийся забирает карты со стола. */
  z.object({
    type: z.literal('take'),
  }),

  /** «Бито» / пас — атакующий больше не подкидывает. */
  z.object({
    type: z.literal('pass'),
  }),
]);

export type GameAction = z.infer<typeof gameActionSchema>;
export type GameActionType = GameAction['type'];

/** Действие вместе с автором и защитой от повторной отправки. */
export const playerActionSchema = z.object({
  userId: z.string(),
  action: gameActionSchema,
  /**
   * Версия состояния, на которой игрок принимал решение.
   * Сервер отвергает действие, если состояние уже ушло вперёд.
   */
  expectedVersion: z.number().int().nonnegative(),
});

export type PlayerAction = z.infer<typeof playerActionSchema>;

/** Причины отказа. Коды стабильны — на них завязана локализация на клиенте. */
export const gameErrorCodeSchema = z.enum([
  'NOT_YOUR_TURN',
  'NOT_IN_GAME',
  'GAME_NOT_ACTIVE',
  'CARD_NOT_IN_HAND',
  'VERSION_MISMATCH',
  'ATTACK_LIMIT_REACHED',
  'RANK_NOT_ON_TABLE',
  'CANNOT_BEAT_CARD',
  'PAIR_ALREADY_DEFENDED',
  'PAIR_NOT_FOUND',
  'TRANSFER_NOT_ALLOWED',
  'TRANSFER_AFTER_DEFENSE',
  'TRANSFER_RANK_MISMATCH',
  'TRANSFER_TARGET_HAS_TOO_FEW_CARDS',
  'NOTHING_TO_TAKE',
  'CANNOT_PASS_AS_DEFENDER',
  'INVALID_ACTION_FOR_PHASE',
  /** Не хватает кредитов на ставку этого стола. */
  'NOT_ENOUGH_CREDITS',
]);

export type GameErrorCode = z.infer<typeof gameErrorCodeSchema>;
