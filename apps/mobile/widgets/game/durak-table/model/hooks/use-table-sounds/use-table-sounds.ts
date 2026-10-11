import { useEffect, useRef } from 'react';

import { haptic } from '@/shared/lib/haptics';
import { playSound } from '@/shared/lib/sound';

import type { TableSnapshot } from '../../../lib';
import type { UseTableSoundsInput } from './use-table-sounds.types';

import { DEAL_STEP_MS } from '../../../config';
import { pickTableSound } from '../../../lib';
import { BEFORE_DEAL, SOUND_HAPTIC } from './use-table-sounds.config';

type Timers = ReturnType<typeof setTimeout>[];

const playDealSeries = (timers: Timers, count: number) => {
  timers.forEach(clearTimeout);
  timers.length = 0;

  for (let step = 1; step <= count; step++) {
    timers.push(setTimeout(playSound, step * DEAL_STEP_MS, 'deal'));
  }
};

export const useTableSounds = ({ view, isMyTurn }: UseTableSoundsInput) => {
  const previousRef = useRef<TableSnapshot | null>(null);
  const wasMyTurnRef = useRef(false);

  const dealTimers = useRef<Timers>([]).current;

  useEffect(() => () => dealTimers.forEach(clearTimeout), [dealTimers]);

  useEffect(() => {
    if (!view) {
      return;
    }

    const current: TableSnapshot = {
      tableSize: view.table.length,
      handSize: view.hand.length,
      beaten: view.table.filter((pair) => pair.defense).length,
      discardCount: view.discardCount
    };

    const isOpeningDeal = view.version === 0;
    const previous = previousRef.current ?? (isOpeningDeal ? BEFORE_DEAL : null);

    previousRef.current = current;

    if (!previous) {
      return;
    }

    const cue = pickTableSound({ current, previous });

    if (!cue) {
      return;
    }

    haptic(SOUND_HAPTIC[cue.sound]);

    if (cue.sound === 'deal') {
      playDealSeries(dealTimers, cue.repeat);

      return;
    }

    playSound(cue.sound);
  }, [view, dealTimers]);

  useEffect(() => {
    if (isMyTurn && !wasMyTurnRef.current) {
      playSound('turn');
      haptic('tap');
    }

    wasMyTurnRef.current = isMyTurn;
  }, [isMyTurn]);
};
