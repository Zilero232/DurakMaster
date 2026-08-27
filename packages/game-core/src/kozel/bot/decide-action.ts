import type { Card, KozelAction, KozelState } from '@durak-master/schemas';

import { seatOf, teamOfSeat } from '../../shared';
import { KOZEL_SEATS } from '../config';
import { cardPoints, isTrump, trickWinnerIndex, trumpStrength } from '../rules';
import { allowedCards, cheapest } from './shared';

const richest = (cards: readonly Card[]): Card | null =>
  cards.reduce<Card | null>((best, card) => {
    if (!best) {
      return card;
    }

    return cardPoints(card) > cardPoints(best) ? card : best;
  }, null);

/**
 * Would this card take the trick as it currently stands? Only meaningful for
 * the last player to act — earlier the trick can still be beaten.
 */
const wouldWin = (state: KozelState, card: Card): boolean => {
  const cards = [...state.trick.map((entry) => entry.card), card];

  return trickWinnerIndex(cards, state.rules) === cards.length - 1;
};

/**
 * A deliberately plain opponent: it follows the rules, avoids handing points to
 * the other team, and dumps value on tricks its own partner is taking.
 */
export function decideBotAction(state: KozelState, userId: string): KozelAction {
  const seat = seatOf(state.players, userId) ?? 0;

  if (state.phase === 'chooseLeader') {
    return { type: 'chooseLeader', seat };
  }

  const allowed = allowedCards(state, userId);
  const [fallback] = allowed;

  if (!fallback) {
    const [any] = state.hands[userId] ?? [];

    return { type: 'play', card: any ?? { rank: 'seven', suit: 'clubs' } };
  }

  // Leading: open cheap, and keep the trumps for later tricks.
  if (state.trick.length === 0) {
    const plain = allowed.filter((card) => !isTrump(card));

    return { type: 'play', card: cheapest(plain.length > 0 ? plain : allowed) ?? fallback };
  }

  const winnerIndex = trickWinnerIndex(
    state.trick.map((entry) => entry.card),
    state.rules
  );
  const leaderSeat = state.trick[winnerIndex]?.seat ?? state.leadSeat;
  const isPartnerWinning = teamOfSeat(leaderSeat) === teamOfSeat(seat);
  const isLastToPlay = state.trick.length === KOZEL_SEATS - 1;

  // The partner already has it and nobody can take it back: throw the points in.
  if (isPartnerWinning && isLastToPlay) {
    return { type: 'play', card: richest(allowed) ?? fallback };
  }

  const winning = allowed.filter((card) => wouldWin(state, card));

  // Take the trick with the weakest card that still does the job.
  if (!isPartnerWinning && winning.length > 0) {
    const cheapestWinner = winning.reduce((best, card) => {
      const bestScore = isTrump(best) ? trumpStrength(best, state.rules) : cardPoints(best);
      const score = isTrump(card) ? trumpStrength(card, state.rules) : cardPoints(card);

      return score > bestScore ? card : best;
    });

    return { type: 'play', card: cheapestWinner };
  }

  return { type: 'play', card: cheapest(allowed) ?? fallback };
}
