import type { PlayerState } from '@durak-master/schemas';

export const seatOf = (players: readonly PlayerState[], userId: string): number | null =>
  players.find((player) => player.userId === userId)?.seat ?? null;

export const userIdAtSeat = (players: readonly PlayerState[], seat: number): string | null =>
  players.find((player) => player.seat === seat)?.userId ?? null;

export const nextSeat = (players: readonly PlayerState[], fromSeat: number): number =>
  (fromSeat + 1) % players.length;

export const withHandCounts = (
  players: readonly PlayerState[],
  hands: Record<string, readonly unknown[]>
): PlayerState[] =>
  players.map((player) => ({ ...player, handCount: hands[player.userId]?.length ?? 0 }));
