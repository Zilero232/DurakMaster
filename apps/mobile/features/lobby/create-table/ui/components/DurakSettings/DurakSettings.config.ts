import type { DurakDeckSize } from '@durak-master/schemas';

import { DURAK_DECK_SIZES } from '@durak-master/schemas';

import type { OptionItem } from '../OptionRow';

export const DECK_SIZE_ITEMS: OptionItem<DurakDeckSize>[] = DURAK_DECK_SIZES.map((size) => ({
  value: size,
  label: String(size)
}));
