import type { Card, Suit } from '@durak-master/schemas';

import type { CardScale, HandSort } from '@/shared/model/preferences';

import type { DropZone } from '../../../model';

export type PlayerHandProps = {
  cards: Card[];
  playableKeys: Set<string>;
  selectedKey: string | null;
  trump: Suit;

  hasHints?: boolean;

  sortMode?: HandSort;

  cardScale?: CardScale;

  isInstant?: boolean;

  dropZones?: DropZone[];

  onDropOn?: (card: Card, pairIndex: number) => void;

  onDropMiss?: (card: Card) => void;

  onHover?: (index: number | null) => void;
  onDragStart?: (card: Card) => void;
  onDragEnd?: () => void;
  onSelect: (card: Card) => void;
};
