import { DISCARD_SCALE } from '../../../config/table-center';

export const CARD_OFFSET = 3;

export const VISIBLE_CARDS = 4;

export const DISCARD_TILT = 7;

export type DiscardLayout = {
  card: { width: number; height: number };
  stack: { width: number; height: number };
};

export type DiscardLayoutInput = {
  cardWidth: number;
  cardHeight: number;
};

export const discardLayout = ({ cardWidth, cardHeight }: DiscardLayoutInput): DiscardLayout => {
  const width = cardWidth * DISCARD_SCALE;
  const height = cardHeight * DISCARD_SCALE;

  return {
    card: { width, height },
    stack: { width: width + CARD_OFFSET * VISIBLE_CARDS, height }
  };
};
