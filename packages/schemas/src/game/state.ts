import { z } from 'zod';

import { cardSchema, suitSchema } from './card';
import { tableSettingsSchema } from './table-settings';

/**
 * Пара «атака → защита» на столе. `defense: null` — карта ещё не отбита.
 */
export const tablePairSchema = z.object({
  attack: cardSchema,
  defense: cardSchema.nullable(),
});

export type TablePair = z.infer<typeof tablePairSchema>;

export const gamePhaseSchema = z.enum([
  /** Ожидание игроков до старта. */
  'waiting',
  /** Идёт отбой: атака/защита/подкидывание. */
  'bout',
  /** Защищающийся объявил «беру», атакующие могут ещё подкинуть. */
  'taking',
  /** Игра завершена, определён дурак (или ничья). */
  'finished',
]);

export type GamePhase = z.infer<typeof gamePhaseSchema>;

export const playerStateSchema = z.object({
  userId: z.string(),
  /** Место за столом, 0-based, по часовой стрелке. */
  seat: z.number().int().nonnegative(),
  /** Количество карт в руке. Сами карты игрок видит только у себя. */
  handCount: z.number().int().nonnegative(),
  /** Игрок вышел из игры (сбросил все карты при пустой колоде) — он в безопасности. */
  isOut: z.boolean(),
  /** Соединение потеряно; ходы делает авто-игрок до реконнекта. */
  isDisconnected: z.boolean(),
});

export type PlayerState = z.infer<typeof playerStateSchema>;

/**
 * Полное состояние игры на СЕРВЕРЕ. Содержит скрытую информацию
 * (руки всех игроков и порядок колоды) и клиенту целиком не отправляется —
 * см. `playerViewSchema`.
 */
export const gameStateSchema = z.object({
  tableId: z.string(),
  settings: tableSettingsSchema,
  phase: gamePhaseSchema,

  players: z.array(playerStateSchema),
  /** Руки по userId. Только сервер. */
  hands: z.record(z.string(), z.array(cardSchema)),
  /** Колода в порядке добора. Только сервер — раскрытие ломает игру. */
  talon: z.array(cardSchema),
  /** Козырная масть. */
  trump: suitSchema,
  /** Козырная карта под колодой — она же последняя в доборе. */
  trumpCard: cardSchema.nullable(),

  /** Карты на столе в текущем отбое. */
  table: z.array(tablePairSchema),
  /** Сброс (отбой). Обычно не виден игрокам. */
  discard: z.array(cardSchema),

  /** Место основного атакующего. */
  attackerSeat: z.number().int().nonnegative(),
  /** Место защищающегося. */
  defenderSeat: z.number().int().nonnegative(),
  /** Чьего действия ждём. */
  activeSeat: z.number().int().nonnegative(),

  /**
   * Предел атакующих карт в текущем отбое: min(6, карт в руке защищающегося
   * НА НАЧАЛО отбоя). Фиксируется в начале и не пересчитывается по ходу —
   * пересчёт по текущей руке защищающегося является ошибкой.
   */
  attackLimit: z.number().int().positive(),

  /** Места игроков, спасовавших в текущем отбое («бито»). */
  passedSeats: z.array(z.number().int().nonnegative()),

  /**
   * Места игроков, уже переводивших показом козыря в этой партии.
   * Показ разрешён один раз за партию — дальше козырь надо выкладывать.
   */
  shownTrumpSeats: z.array(z.number().int().nonnegative()),

  /** Абсолютный дедлайн хода (мс, epoch). Позволяет восстановить таймер после рестарта. */
  turnDeadline: z.number().int().nullable(),

  /** Порядковый номер состояния — для идемпотентности и защиты от гонок. */
  version: z.number().int().nonnegative(),

  /** Проигравший (дурак). Заполняется в фазе `finished`. */
  loserUserId: z.string().nullable(),
  /** Игра закончилась ничьёй. */
  isDraw: z.boolean(),
});

export type GameState = z.infer<typeof gameStateSchema>;

/**
 * То, что реально уходит клиенту: своя рука целиком, у остальных — только счётчики,
 * из колоды — только размер. Фильтрация делается на сервере; клиент не должен
 * получать скрытые данные и «прятать» их у себя.
 */
export const playerViewSchema = gameStateSchema
  .omit({ hands: true, talon: true, discard: true })
  .extend({
    /** Карты запрашивающего игрока. */
    hand: z.array(cardSchema),
    /** Сколько карт осталось в колоде. */
    talonCount: z.number().int().nonnegative(),
    /** Сколько карт в сбросе. */
    discardCount: z.number().int().nonnegative(),
    /**
     * Содержимое отбоя.
     *
     * Раскрывается намеренно: эти карты уже побывали на столе, и все игроки
     * их видели — скрывать их значит наказывать тех, у кого хуже память.
     * Скрытой информации здесь нет, в отличие от рук и порядка колоды.
     */
    discardPile: z.array(cardSchema),
  });

export type PlayerView = z.infer<typeof playerViewSchema>;
