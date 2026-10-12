import type { LayoutChangeEvent } from 'react-native';

import { useState } from 'react';

import { card } from '@/ui-kit';

import type { UseFieldCardInput } from './use-field-card.types';

import { fitFieldCard } from '../../../lib';
import { useCardSize } from '../use-card-size';

export const useFieldCard = ({ slots, gap }: UseFieldCardInput) => {
  const regular = useCardSize();

  const [field, setField] = useState<{ width: number; height: number } | null>(null);

  const onLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;

    setField({ width, height });
  };

  const width = field
    ? fitFieldCard({
        slots,
        fieldWidth: field.width,
        fieldHeight: field.height,
        maxWidth: regular.width,
        gap,
        cardRatio: card.ratio
      })
    : regular.width;

  return { width, height: Math.floor(width / card.ratio), onLayout };
};
