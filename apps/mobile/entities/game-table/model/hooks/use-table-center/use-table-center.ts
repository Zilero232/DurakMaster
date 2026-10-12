import type { LayoutChangeEvent } from 'react-native';

import { useState } from 'react';

import { card as cardTokens } from '@/ui-kit';

import type { UseTableCenterInput } from './use-table-center.types';

import { DISCARD_SPAN, TALON_SPAN } from '../../../config';
import { fitTableCenter } from '../../../lib';
import { useCardSize } from '../use-card-size';
import { CENTER_GAP } from './use-table-center.config';

export const useTableCenter = ({ slots }: UseTableCenterInput) => {
  const regular = useCardSize();

  const [area, setArea] = useState({ width: 0, height: 0 });

  const onLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;

    setArea({ width, height });
  };

  const isMeasured = area.width > 0;

  const metrics = fitTableCenter({
    width: area.width,
    height: area.height,
    slots,
    maxCardWidth: regular.width,
    gap: CENTER_GAP,
    cardRatio: cardTokens.ratio
  });

  return {
    isMeasured,
    card: metrics.card,
    field: metrics.field,
    talon: metrics.card * TALON_SPAN,
    discard: metrics.card * DISCARD_SPAN,
    gap: CENTER_GAP,
    onLayout
  };
};
