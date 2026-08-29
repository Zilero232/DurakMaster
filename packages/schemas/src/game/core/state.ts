import { z } from 'zod';

import type { GameId } from './game-id';

import { durakStateSchema, durakViewSchema } from '../games/durak';

export const gameStateSchema = z.discriminatedUnion('game', [durakStateSchema]);

export type GameState = z.infer<typeof gameStateSchema>;

export type StateForGame<G extends GameId> = Extract<GameState, { game: G }>;

export const playerViewSchema = z.discriminatedUnion('game', [durakViewSchema]);

export type PlayerView = z.infer<typeof playerViewSchema>;

export type ViewForGame<G extends GameId> = Extract<PlayerView, { game: G }>;
