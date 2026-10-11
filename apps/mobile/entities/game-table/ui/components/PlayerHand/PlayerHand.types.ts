import type { Card } from '@durak-master/schemas';

import type { HandSort } from '@/shared/model/preferences';

import type { TrumpTest } from '../../../lib';
import type { DropZone } from '../../../model';

export type PlayerHandProps = {
  cards: Card[];
  playableKeys: Set<string>;
  selectedKey?: string | null;
  trump: TrumpTest;

  hasHints?: boolean;

  sortMode?: HandSort;

  isInstant?: boolean;

  dropZones?: DropZone[];

  onDropOn?: (card: Card, pairIndex: number) => void;

  onDropMiss?: (card: Card, travelY: number) => void;

  onHover?: (index: number | null) => void;
  onDragStart?: (card: Card) => void;
  onDragEnd?: () => void;
  onSelect: (card: Card) => void;
};
