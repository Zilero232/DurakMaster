import type { Card } from '@durak-master/schemas';

import { KOZEL_CARD_POINTS } from '@durak-master/schemas';

import { cardPointsIn, sumPoints } from '../../shared';

export const cardPoints = cardPointsIn(KOZEL_CARD_POINTS);

export const handPoints = (cards: readonly Card[]): number => sumPoints(cards, cardPoints);
