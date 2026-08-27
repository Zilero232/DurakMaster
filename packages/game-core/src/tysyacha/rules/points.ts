import type { Card } from '@durak-master/schemas';

import { TYSYACHA_CARD_POINTS, TYSYACHA_RANK_ORDER } from '@durak-master/schemas';

import { cardPointsIn, rankValueIn, sumPoints } from '../../shared';

export const rankValue = rankValueIn(TYSYACHA_RANK_ORDER);

export const cardPoints = cardPointsIn(TYSYACHA_CARD_POINTS);

export const handPoints = (cards: readonly Card[]): number => sumPoints(cards, cardPoints);
