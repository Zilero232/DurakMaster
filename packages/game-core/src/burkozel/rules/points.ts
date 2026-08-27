import type { Card } from '@durak-master/schemas';

import { BURKOZEL_CARD_POINTS, BURKOZEL_RANK_ORDER } from '@durak-master/schemas';

import { cardPointsIn, rankValueIn, sumPoints } from '../../shared';

/** Value of a card in the pot: aces and tens carry the deal, sixes are ballast. */
export const cardPoints = cardPointsIn(BURKOZEL_CARD_POINTS);

/** Strength by burkozel's own rank order — the ten sits between king and ace. */
export const burkozelRankValue = rankValueIn(BURKOZEL_RANK_ORDER);

export const setPoints = (cards: readonly Card[]): number => sumPoints(cards, cardPoints);
