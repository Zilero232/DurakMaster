import { z } from 'zod';

import type { GameId } from './game-id';

import { burkozelStateSchema, burkozelViewSchema } from '../games/burkozel';
import { durakStateSchema, durakViewSchema } from '../games/durak';
import { kozelStateSchema, kozelViewSchema } from '../games/kozel';
import { tysyachaStateSchema, tysyachaViewSchema } from '../games/tysyacha';

export const gameStateSchema = z.discriminatedUnion('game', [
  durakStateSchema,
  burkozelStateSchema,
  kozelStateSchema,
  tysyachaStateSchema
]);

export type GameState = z.infer<typeof gameStateSchema>;

export type StateForGame<G extends GameId> = Extract<GameState, { game: G }>;

export const playerViewSchema = z.discriminatedUnion('game', [
  durakViewSchema,
  burkozelViewSchema,
  kozelViewSchema,
  tysyachaViewSchema
]);

export type PlayerView = z.infer<typeof playerViewSchema>;

export type ViewForGame<G extends GameId> = Extract<PlayerView, { game: G }>;
