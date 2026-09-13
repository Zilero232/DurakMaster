import type { ZoneAtInput } from './zone-at.types';

export const zoneAt = ({ zones, x, y }: ZoneAtInput): number | null => {
  'worklet';

  for (const zone of zones) {
    if (x >= zone.x && x <= zone.x + zone.width && y >= zone.y && y <= zone.y + zone.height) {
      return zone.index;
    }
  }

  return null;
};
