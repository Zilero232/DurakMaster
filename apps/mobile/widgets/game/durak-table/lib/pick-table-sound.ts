import type { PickTableSoundInput, TableSoundCue } from './pick-table-sound.types';

import { MAX_DEAL_STEPS } from '../config';

export const pickTableSound = ({
  current,
  previous
}: PickTableSoundInput): TableSoundCue | null => {
  if (current.beaten > previous.beaten) {
    return { sound: 'beat', repeat: 1 };
  }

  if (current.tableSize > previous.tableSize) {
    return { sound: 'play', repeat: 1 };
  }

  if (current.tableSize === 0 && previous.tableSize > 0) {
    return { sound: current.discardCount > previous.discardCount ? 'pass' : 'take', repeat: 1 };
  }

  if (current.handSize > previous.handSize) {
    if (previous.handSize === 0) {
      return { sound: 'shuffle', repeat: 1 };
    }

    return {
      sound: 'deal',
      repeat: Math.min(current.handSize - previous.handSize, MAX_DEAL_STEPS)
    };
  }

  return null;
};
