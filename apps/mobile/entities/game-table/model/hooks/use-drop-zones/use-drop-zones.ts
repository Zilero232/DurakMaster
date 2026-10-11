import { useCallback, useEffect, useRef } from 'react';

import type { DropZone } from '../../drop-zone';
import type { UseDropZonesInput, UseDropZonesResult } from './use-drop-zones.types';

const isSameZone = (left: DropZone | undefined, right: DropZone) =>
  left?.x === right.x &&
  left.y === right.y &&
  left.width === right.width &&
  left.height === right.height;

export const useDropZones = ({ slotCount, onChange }: UseDropZonesInput): UseDropZonesResult => {
  const zonesRef = useRef<Map<number, DropZone>>(new Map());

  useEffect(() => {
    for (const index of zonesRef.current.keys()) {
      if (index >= slotCount) {
        zonesRef.current.delete(index);
      }
    }

    onChange?.([...zonesRef.current.values()]);
  }, [slotCount, onChange]);

  const onMeasure = useCallback(
    (zone: DropZone) => {
      if (isSameZone(zonesRef.current.get(zone.index), zone)) {
        return;
      }

      zonesRef.current.set(zone.index, zone);
      onChange?.([...zonesRef.current.values()]);
    },
    [onChange]
  );

  return { onMeasure };
};
