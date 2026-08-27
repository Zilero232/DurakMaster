import type { Card } from '@durak-master/schemas';

import {
  KOZEL_TOTAL_POINTS,
  KOZEL_TRICKS_PER_DEAL,
  KOZEL_WINNING_POINTS
} from '@durak-master/schemas';

import { handPoints } from './rules';

export type TeamIndex = 0 | 1;

/** Partners sit opposite each other, so seats alternate around the circle: A B A B. */
export const teamOfSeat = (seat: number): TeamIndex => (seat % 2) as TeamIndex;

export const otherTeam = (team: TeamIndex): TeamIndex => (team === 0 ? 1 : 0);

/** A team escapes a double loss by reaching this many points ("spas"). */
const SPAS_POINTS = 31;

/** From here up the winner takes two pairs instead of one. */
const DOUBLE_WIN_POINTS = 90;

const EGGS_POINTS = 60;

export type DealOutcome = {
  points: [number, number];
  tricks: [number, number];
  /** Pairs added to each team's scoreboard this deal. */
  pairsGained: [number, number];
  /** A team whose scoreboard a "lyusya" resets to zero, if any. */
  resetTeam: TeamIndex | null;
  /** The deal ended 60:60 — nobody scores, and the game remembers it forever. */
  hadEggs: boolean;
  winnerTeam: TeamIndex | null;
};

type ScoreDealInput = {
  wonCards: Record<string, Card[]>;
  tricksWon: Record<string, number>;
  seatByUserId: Record<string, number>;
};

/**
 * Result of a finished deal.
 *
 * Only the winner's scoreboard ever moves — this counts wins, not penalties.
 * The branches are checked in a fixed order, because they overlap: a "lyusya"
 * (all 120 points and all eight tricks) also satisfies the ≥ 90 condition, yet
 * it pays no pairs at all and instead rolls the opponent back to zero.
 */
export const scoreDeal = ({ wonCards, tricksWon, seatByUserId }: ScoreDealInput): DealOutcome => {
  const points: [number, number] = [0, 0];
  const tricks: [number, number] = [0, 0];

  for (const [userId, seat] of Object.entries(seatByUserId)) {
    const team = teamOfSeat(seat);

    points[team] += handPoints(wonCards[userId] ?? []);
    tricks[team] += tricksWon[userId] ?? 0;
  }

  const total = points[0] + points[1];

  // The deck holds exactly 120 points: a mismatch means tricks were awarded wrong.
  if (total !== KOZEL_TOTAL_POINTS) {
    throw new Error(`Kozel deal scored ${total} points instead of ${KOZEL_TOTAL_POINTS}`);
  }

  const pairsGained: [number, number] = [0, 0];

  if (points[0] === EGGS_POINTS && points[1] === EGGS_POINTS) {
    return { points, tricks, pairsGained, resetTeam: null, hadEggs: true, winnerTeam: null };
  }

  const winnerTeam: TeamIndex = points[0] >= KOZEL_WINNING_POINTS ? 0 : 1;
  const loserTeam = otherTeam(winnerTeam);

  // "Lyusya": every point and every trick. Resets the opponent, pays nothing.
  if (points[winnerTeam] === KOZEL_TOTAL_POINTS && tricks[winnerTeam] === KOZEL_TRICKS_PER_DEAL) {
    return { points, tricks, pairsGained, resetTeam: loserTeam, hadEggs: false, winnerTeam };
  }

  // Two pairs need both a big score and the loser having taken at least one trick.
  const isDoubleWin =
    points[winnerTeam] >= DOUBLE_WIN_POINTS &&
    points[loserTeam] < SPAS_POINTS &&
    tricks[loserTeam] > 0;

  pairsGained[winnerTeam] = isDoubleWin ? 2 : 1;

  return { points, tricks, pairsGained, resetTeam: null, hadEggs: false, winnerTeam };
};
