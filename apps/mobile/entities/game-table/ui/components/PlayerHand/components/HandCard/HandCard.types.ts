import type { Card } from '@durak-master/schemas';

import type { DropZone } from '../../../../../model';

export type HandCardProps = {
  card: Card;

  /** Stacking order and fan position, both driven by where the card sits in the hand. */
  index: number;
  offset: number;
  fanDrop: number;
  overlap: number;
  width: number;
  isLast: boolean;
  isPlayable: boolean;
  isSelected: boolean;
  hasHint: boolean;
  isInstant: boolean;
  dropZones: DropZone[];
  onDropOn: (pairIndex: number) => void;
  onDropMiss: (travelY: number) => void;
  onHover: (hovered: number | null) => void;
  onDragStart: () => void;
  onDragEnd: () => void;
  onPlay: () => void;
};
