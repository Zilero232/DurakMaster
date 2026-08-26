import type { DeckSize, GameSpeed } from '@durak-master/schemas';

import { MAX_PLAYERS, MIN_PLAYERS } from '@durak-master/schemas';

import type { OptionItem } from './components';

export const PLAYER_COUNT_ITEMS: OptionItem<number>[] = Array.from(
  { length: MAX_PLAYERS - MIN_PLAYERS + 1 },
  (_, index) => {
    const count = MIN_PLAYERS + index;

    return { value: count, label: String(count) };
  }
);

const DECK_SIZES: DeckSize[] = [24, 36, 52];

export const DECK_SIZE_ITEMS: OptionItem<DeckSize>[] = DECK_SIZES.map((size) => ({
  value: size,
  label: String(size)
}));

export const SPEED_ITEMS: {
  value: GameSpeed;
  labelKey: 'create.speedFast' | 'create.speedNormal';
}[] = [
  { value: 'normal', labelKey: 'create.speedNormal' },
  { value: 'fast', labelKey: 'create.speedFast' }
];
