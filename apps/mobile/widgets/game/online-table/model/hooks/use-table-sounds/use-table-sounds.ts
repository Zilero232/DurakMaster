import type { ViewForGame } from '@durak-master/schemas';

import { useEffect, useRef } from 'react';

import { haptic } from '@/shared/lib/haptics';
import { playSound } from '@/shared/lib/sound';

export const useTableSounds = (view: ViewForGame<'durak'> | null, isMyTurn: boolean) => {
  const prevTableSizeRef = useRef(0);
  const prevHandSizeRef = useRef(0);
  const wasMyTurnRef = useRef(false);

  useEffect(() => {
    if (!view) {
      return;
    }

    const tableSize = view.table.length;
    const handSize = view.hand.length;

    if (tableSize > prevTableSizeRef.current) {
      const isBeat = view.table.some((pair) => pair.defense);

      playSound(isBeat ? 'beat' : 'play');
      haptic(isBeat ? 'beat' : 'play');
    } else if (tableSize === 0 && prevTableSizeRef.current > 0) {
      const isTake = handSize > prevHandSizeRef.current;

      playSound(isTake ? 'take' : 'pass');
      haptic(isTake ? 'take' : 'play');
    } else if (handSize > prevHandSizeRef.current) {
      playSound('deal');
    }

    prevTableSizeRef.current = tableSize;
    prevHandSizeRef.current = handSize;
  }, [view]);

  useEffect(() => {
    if (isMyTurn && !wasMyTurnRef.current) {
      playSound('turn');
      haptic('tap');
    }

    wasMyTurnRef.current = isMyTurn;
  }, [isMyTurn]);
};
