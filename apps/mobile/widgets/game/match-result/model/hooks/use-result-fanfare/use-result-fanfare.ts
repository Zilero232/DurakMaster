import { useEffect } from 'react';

import { haptic } from '@/shared/lib/haptics';
import { playSound } from '@/shared/lib/sound';

import type { UseResultFanfareInput } from './use-result-fanfare.types';

export const useResultFanfare = ({ isDraw, isLoser }: UseResultFanfareInput) => {
  useEffect(() => {
    if (isDraw) {
      return;
    }

    playSound(isLoser ? 'lose' : 'win');
    haptic(isLoser ? 'lose' : 'win');
  }, [isDraw, isLoser]);
};
