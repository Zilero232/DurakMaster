import type { DurakDeckSize, GameId, GameSpeed } from '@durak-master/schemas';

import {
  maxDurakPlayers,
  PLAYER_RANGE_BY_GAME,
  TURN_SECONDS_BY_SPEED
} from '@durak-master/schemas';

import { spacing } from '@/ui-kit';

import type { OptionItem } from './components/OptionRow';

export const playerCountItems = (game: GameId, deckSize?: DurakDeckSize): OptionItem<number>[] => {
  const { min, max: range } = PLAYER_RANGE_BY_GAME[game];

  const max = game === 'durak' && deckSize ? Math.min(range, maxDurakPlayers(deckSize)) : range;

  return Array.from({ length: max - min + 1 }, (_, index) => {
    const count = min + index;

    return { value: count, label: String(count) };
  });
};

export const SPEED_ITEMS: {
  value: GameSpeed;
  labelKey: 'create.speedFast' | 'create.speedNormal';
  seconds: number;
}[] = [
  { value: 'normal', labelKey: 'create.speedNormal', seconds: TURN_SECONDS_BY_SPEED.normal },
  { value: 'fast', labelKey: 'create.speedFast', seconds: TURN_SECONDS_BY_SPEED.fast }
];

export const KEYBOARD_BOTTOM_OFFSET = spacing[6];
