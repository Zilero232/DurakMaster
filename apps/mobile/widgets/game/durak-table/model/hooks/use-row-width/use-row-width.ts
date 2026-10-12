import type { LayoutChangeEvent } from 'react-native';

import { useState } from 'react';

export const useRowWidth = () => {
  const [width, setWidth] = useState<number>();

  const measure = (event: LayoutChangeEvent) => setWidth(event.nativeEvent.layout.width);

  return { width, measure };
};
