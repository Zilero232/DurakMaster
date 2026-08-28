import type { PlayerState } from '@durak-master/schemas';

export const teamOfSeat = (seat: number): number => seat % 2;

export const otherTeam = (team: number): number => (team === 0 ? 1 : 0);

export const teamSeats = (players: readonly PlayerState[], team: number): PlayerState[] =>
  players.filter((player) => teamOfSeat(player.seat) === team);
