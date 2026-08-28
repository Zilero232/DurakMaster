import type { Card } from '@durak-master/schemas';

import type { CardScale, HandSort } from '@/shared/model/preferences';

import type { TrumpTest } from '../../../lib';
import type { DropZone } from '../../../model';

export type PlayerHandProps = {
  cards: Card[];
  playableKeys: Set<string>;
  selectedKey?: string | null;
  selectedKeys?: Set<string>;
  trump: TrumpTest;

  hasHints?: boolean;

  sortMode?: HandSort;

  cardScale?: CardScale;

  isInstant?: boolean;

  dropZones?: DropZone[];

  onDropOn?: (card: Card, pairIndex: number) => void;

  onDropMiss?: (card: Card, travelY: number) => void;

  onHover?: (index: number | null) => void;
  onDragStart?: (card: Card) => void;
  onDragEnd?: () => void;
  onSelect: (card: Card) => void;
};
