import { z } from 'zod';

import { deckSizeSchema } from './card';

/**
 * Основной режим отбоя.
 *
 * `throwIn`  — подкидной: защищающийся обязан отбиваться или брать.
 * `transfer` — переводной: защищающийся может перевести атаку следующему,
 *              подложив карту того же ранга. Меняет машину состояний.
 */
export const gameModeSchema = z.enum(['throwIn', 'transfer']);
export type GameMode = z.infer<typeof gameModeSchema>;

/**
 * Кто может подкидывать.
 *
 * `neighbors` — только соседи защищающегося (атакующий и следующий за ним).
 * `all`       — все игроки за столом.
 */
export const throwInScopeSchema = z.enum(['neighbors', 'all']);
export type ThrowInScope = z.infer<typeof throwInScopeSchema>;

/**
 * Честность игры.
 *
 * `fair`      — сервер отвергает недопустимые ходы.
 * `cheaters`  — «с шулерами»: недопустимый ход принимается, но остальные
 *               игроки могут его оспорить. Фишка RstGames.
 */
export const fairnessSchema = z.enum(['fair', 'cheaters']);
export type Fairness = z.infer<typeof fairnessSchema>;

/** Темп игры — влияет только на длительность хода. */
export const gameSpeedSchema = z.enum(['normal', 'fast']);
export type GameSpeed = z.infer<typeof gameSpeedSchema>;

export const MIN_PLAYERS = 2;
export const MAX_PLAYERS = 6;

/** Максимум атакующих карт в одном отбое — жёсткий предел правил. */
export const MAX_ATTACK_CARDS_PER_BOUT = 6;

/** Секунд на ход по темпу игры. */
export const TURN_SECONDS_BY_SPEED: Record<GameSpeed, number> = {
  normal: 30,
  fast: 15,
};

export const tableSettingsSchema = z.object({
  mode: gameModeSchema,
  deckSize: deckSizeSchema,
  maxPlayers: z.number().int().min(MIN_PLAYERS).max(MAX_PLAYERS),

  /** Кто вправе подкидывать. */
  throwInScope: throwInScopeSchema,

  /** Обычная игра или «с шулерами». */
  fairness: fairnessSchema,

  /** Темп игры. */
  speed: gameSpeedSchema,

  /**
   * Разрешена ли ничья: колода пуста и в конце отбоя ни у кого нет карт.
   */
  allowDraw: z.boolean(),

  /**
   * «Классика» — первым ходит владелец младшего козыря. Если выключено,
   * первым ходит игрок слева от сдающего.
   */
  isClassic: z.boolean(),

  /**
   * Перевод козырем «показом»: защищающийся показывает козырь того же ранга,
   * не выкладывая его. Подвариант переводного.
   */
  allowTransferByShowingTrump: z.boolean(),

  /** Ставка за вход в кредитах. */
  bet: z.number().int().nonnegative(),

  /** Приватный стол — вход по паролю. */
  isPrivate: z.boolean(),

  /** Секунд на ход. Выводится из `speed`, хранится явно для снапшотов. */
  turnTimeoutSeconds: z.number().int().min(5).max(120),
});

export type TableSettings = z.infer<typeof tableSettingsSchema>;

export const DEFAULT_TABLE_SETTINGS: TableSettings = {
  mode: 'throwIn',
  deckSize: 36,
  maxPlayers: 4,
  throwInScope: 'neighbors',
  fairness: 'fair',
  speed: 'normal',
  allowDraw: true,
  isClassic: true,
  allowTransferByShowingTrump: false,
  bet: 100,
  isPrivate: false,
  turnTimeoutSeconds: TURN_SECONDS_BY_SPEED.normal,
};

/** Доступные номиналы ставок — как ступени слайдера в лобби. */
export const BET_STEPS = [
  100, 500, 1_000, 5_000, 10_000, 50_000, 100_000, 500_000, 1_000_000, 10_000_000,
] as const;
