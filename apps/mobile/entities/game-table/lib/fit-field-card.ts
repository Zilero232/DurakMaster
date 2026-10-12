import { range } from 'remeda';

import type { FitFieldCardInput } from './fit-field-card.types';

import { DEFENSE_OFFSET_RATIO } from '../config/field';

const PAIR_WIDTH_PER_CARD = 1 + DEFENSE_OFFSET_RATIO.x;

const widthForColumns =
  ({ slots, fieldWidth, fieldHeight, gap, cardRatio }: FitFieldCardInput) =>
  (columns: number) => {
    const rows = Math.ceil(slots / columns);
    const byWidth = (fieldWidth - gap * (columns - 1)) / (columns * PAIR_WIDTH_PER_CARD);
    const byHeight =
      (fieldHeight - gap * (rows - 1)) / ((rows * (1 + DEFENSE_OFFSET_RATIO.y)) / cardRatio);

    return Math.min(byWidth, byHeight);
  };

export const fitFieldCard = (input: FitFieldCardInput): number => {
  const { slots, maxWidth } = input;

  if (slots === 0) {
    return maxWidth;
  }

  const best = Math.max(...range(1, slots + 1).map(widthForColumns(input)));

  return Math.floor(Math.max(0, Math.min(best, maxWidth)));
};
