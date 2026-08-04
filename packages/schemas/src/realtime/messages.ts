import { z } from 'zod';

import { gameActionSchema, gameErrorCodeSchema } from '../game/action';
import { playerViewSchema } from '../game/state';
import { createTableInputSchema, joinTableInputSchema, lobbyTableSchema } from '../lobby/table';
import { publicProfileSchema } from '../profile/profile';
import { quickPhraseIdSchema } from './phrases';

/**
 * Протокол WebSocket.
 *
 * Оба направления — дискриминированные объединения по `type`. Сервер
 * валидирует каждое входящее сообщение схемой перед обработкой: доверять
 * форме клиентских данных нельзя.
 */

// --- Клиент → сервер -------------------------------------------------------

export const clientMessageSchema = z.discriminatedUnion('type', [
  /** Подписка на список столов. */
  z.object({ type: z.literal('lobby:subscribe') }),
  z.object({ type: z.literal('lobby:unsubscribe') }),

  z.object({ type: z.literal('table:create'), payload: createTableInputSchema }),
  z.object({ type: z.literal('table:join'), payload: joinTableInputSchema }),
  z.object({ type: z.literal('table:leave') }),
  z.object({ type: z.literal('table:ready'), payload: z.object({ isReady: z.boolean() }) }),

  /**
   * Посадить бота на свободное место. Позволяет начать партию, не дожидаясь
   * живых соперников; доступно только создателю стола до старта.
   */
  z.object({ type: z.literal('table:add-bot') }),

  /**
   * Игровое действие. `expectedVersion` защищает от гонок и повторной
   * отправки: сервер отвергает действие, если состояние ушло вперёд.
   */
  z.object({
    type: z.literal('game:action'),
    payload: z.object({
      action: gameActionSchema,
      expectedVersion: z.number().int().nonnegative(),
    }),
  }),

  /** Эмодзи-реакция за столом. */
  z.object({
    type: z.literal('table:emoji'),
    payload: z.object({ emoji: z.string().min(1).max(8) }),
  }),

  /**
   * Готовая фраза за столом.
   *
   * Вместо свободного чата: набор фиксирован, поэтому не нужны модерация,
   * фильтр мата и перевод пользовательского текста, а стол остаётся
   * пригодным для возрастного рейтинга 12+. Клиент присылает только
   * идентификатор — сам текст подставляет получатель на своём языке.
   */
  z.object({
    type: z.literal('table:phrase'),
    payload: z.object({ phraseId: quickPhraseIdSchema }),
  }),

  /** Пинг для контроля живости соединения. */
  z.object({ type: z.literal('ping') }),
]);

export type ClientMessage = z.infer<typeof clientMessageSchema>;
export type ClientMessageType = ClientMessage['type'];

// --- Сервер → клиент -------------------------------------------------------

/**
 * Фраза за столом. Текста здесь нет намеренно — только идентификатор
 * из фиксированного набора, чтобы каждый видел реплику на своём языке
 * и чтобы через стол нельзя было передать произвольный текст.
 */
export const tablePhraseSchema = z.object({
  id: z.string(),
  userId: z.string(),
  phraseId: quickPhraseIdSchema,
  sentAt: z.number().int(),
});

export type TablePhrase = z.infer<typeof tablePhraseSchema>;

export const serverMessageSchema = z.discriminatedUnion('type', [
  /** Подтверждение подключения с профилем игрока. */
  z.object({
    type: z.literal('connected'),
    payload: z.object({ profile: publicProfileSchema }),
  }),

  /** Полный список столов — приходит после подписки. */
  z.object({
    type: z.literal('lobby:tables'),
    payload: z.object({ tables: z.array(lobbyTableSchema) }),
  }),

  /** Точечное обновление одного стола. */
  z.object({
    type: z.literal('lobby:table-updated'),
    payload: z.object({ table: lobbyTableSchema }),
  }),

  z.object({
    type: z.literal('lobby:table-removed'),
    payload: z.object({ tableId: z.string() }),
  }),

  /** Игрок сел за стол — приходит ему одному. */
  z.object({
    type: z.literal('table:joined'),
    payload: z.object({ table: lobbyTableSchema, seat: z.number().int() }),
  }),

  z.object({ type: z.literal('table:left') }),

  /**
   * Состояние партии, отфильтрованное под получателя. Чужие руки и порядок
   * колоды сюда не попадают — фильтрация только на сервере.
   */
  z.object({
    type: z.literal('game:state'),
    payload: z.object({
      view: playerViewSchema,
      players: z.array(publicProfileSchema),
    }),
  }),

  /** Действие отвергнуто. */
  z.object({
    type: z.literal('game:rejected'),
    payload: z.object({ code: gameErrorCodeSchema }),
  }),

  /** Итог партии. */
  z.object({
    type: z.literal('game:finished'),
    payload: z.object({
      loserUserId: z.string().nullable(),
      isDraw: z.boolean(),
      creditsDelta: z.number().int(),
      ratingDelta: z.number().int(),
    }),
  }),

  z.object({
    type: z.literal('table:emoji'),
    payload: z.object({ userId: z.string(), emoji: z.string() }),
  }),

  z.object({
    type: z.literal('table:phrase'),
    payload: z.object({ phrase: tablePhraseSchema }),
  }),

  /** Ошибка уровня протокола или прав. */
  z.object({
    type: z.literal('error'),
    payload: z.object({ message: z.string(), code: z.string().optional() }),
  }),

  z.object({ type: z.literal('pong') }),
]);

export type ServerMessage = z.infer<typeof serverMessageSchema>;
export type ServerMessageType = ServerMessage['type'];
