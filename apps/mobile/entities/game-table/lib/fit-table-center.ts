import type { FitTableCenterInput, TableCenterMetrics } from './fit-table-center.types';

import { DEFENSE_OFFSET_RATIO } from '../config/field';
import { DISCARD_SPAN, FIELD_COLUMNS, MIN_FIELD_ROWS, TALON_SPAN } from '../config/table-center';

const PAIR_SPAN = 1 + DEFENSE_OFFSET_RATIO.x;

export const fitTableCenter = ({
  width,
  height,
  slots,
  maxCardWidth,
  gap,
  cardRatio
}: FitTableCenterInput): TableCenterMetrics => {
  const rows = Math.max(MIN_FIELD_ROWS, Math.ceil(slots / FIELD_COLUMNS));
  const gaps = gap * (FIELD_COLUMNS - 1) + gap * 2;
  const spans = TALON_SPAN + FIELD_COLUMNS * PAIR_SPAN + DISCARD_SPAN;
  const pairHeight = (1 + DEFENSE_OFFSET_RATIO.y) / cardRatio;

  const byWidth = (width - gaps) / spans;
  const byHeight = (height - gap * (rows - 1)) / (rows * pairHeight);

  const card = Math.floor(Math.max(0, Math.min(byWidth, byHeight, maxCardWidth)));

  return { card, field: card * PAIR_SPAN * FIELD_COLUMNS + gap * (FIELD_COLUMNS - 1) };
};
