import { useEffect, useRef } from 'react';

import { DEAL_STAGGER_MS } from '@/entities/game-table';
import { useAnimationSpeed } from '@/entities/settings';
import { haptic } from '@/shared/lib/haptics';
import { playSound } from '@/shared/lib/sound';

import type { TableSnapshot } from '../../../lib';
import type { UseTableSoundsInput } from './use-table-sounds.types';

import { pickTableSound } from '../../../lib';
import {
  BEFORE_DEAL,
  CARD_LANDING_MS,
  LANDING_SOUNDS,
  SOUND_HAPTIC
} from './use-table-sounds.config';

type Timers = ReturnType<typeof setTimeout>[];

const clearTimers = (timers: Timers) => {
  timers.forEach(clearTimeout);
  timers.length = 0;
};

const playDealSeries = (timers: Timers, count: number) => {
  clearTimers(timers);

  for (let step = 0; step < count; step++) {
    timers.push(setTimeout(playSound, step * DEAL_STAGGER_MS, 'deal'));
  }
};

export const useTableSounds = ({ view, isMyTurn }: UseTableSoundsInput) => {
  const { isInstant } = useAnimationSpeed();

  const previousRef = useRef<TableSnapshot | null>(null);
  const wasMyTurnRef = useRef(false);

  const timers = useRef<Timers>([]).current;

  const landingDelay = isInstant ? 0 : CARD_LANDING_MS;

  useEffect(() => () => timers.forEach(clearTimeout), [timers]);

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

    if (cue.sound === 'deal') {
      haptic(SOUND_HAPTIC.deal);
      playDealSeries(timers, cue.repeat);

      return;
    }

    if (LANDING_SOUNDS.has(cue.sound)) {
      const { sound } = cue;

      const landing = setTimeout(() => {
        haptic(SOUND_HAPTIC[sound]);
        playSound(sound);
      }, landingDelay);

      return () => clearTimeout(landing);
    }

    haptic(SOUND_HAPTIC[cue.sound]);
    playSound(cue.sound);
  }, [view, timers, landingDelay]);

  useEffect(() => {
    if (isMyTurn && !wasMyTurnRef.current) {
      playSound('turn');
      haptic('tap');
    }

    wasMyTurnRef.current = isMyTurn;
  }, [isMyTurn]);
};
