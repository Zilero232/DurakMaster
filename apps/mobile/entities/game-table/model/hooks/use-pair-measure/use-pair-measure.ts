import type { View } from 'react-native';

import { useCallback, useEffect, useRef } from 'react';

import type { UsePairMeasureInput } from './use-pair-measure.types';

import { SETTLE_MS } from '../../../config';

export const usePairMeasure = ({
  index,
  width,
  height,
  hasDefense,
  onMeasure
}: UsePairMeasureInput) => {
  const viewRef = useRef<View>(null);

  const measure = useCallback(() => {
    viewRef.current?.measureInWindow((x, y, measuredWidth, measuredHeight) => {
      if (measuredWidth > 0 && measuredHeight > 0) {
        onMeasure({ index, x, y, width: measuredWidth, height: measuredHeight });
      }
    });
  }, [index, onMeasure]);

  useEffect(() => {
    const timer = setTimeout(measure, SETTLE_MS);

    return () => clearTimeout(timer);
  }, [measure, width, height, hasDefense]);

  return { viewRef, measure };
};
