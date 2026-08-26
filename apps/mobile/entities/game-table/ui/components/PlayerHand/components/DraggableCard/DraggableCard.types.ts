import type { Card } from '@durak-master/schemas';

import type { DropZone } from '../../../../../model';

export type DraggableCardProps = {
  card: Card;
  rotation: number;

  width: number;
  isPlayable: boolean;
  isDimmed: boolean;
  isSelected: boolean;

  dropZones: DropZone[];

  onDropOn: (index: number) => void;

  onDropMiss: () => void;
  onPlay: () => void;

  onHover: (index: number | null) => void;

  onDragStart: () => void;

  onDragEnd: () => void;
};
