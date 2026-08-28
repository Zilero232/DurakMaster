import type { Card } from '@durak-master/schemas';

import type { CardScale } from '@/shared/model/preferences';

export type TrickPlay = {
  seat: number;
  cards: (Card | null)[];
};

export type TrickFieldProps = {
  plays: TrickPlay[];
  mySeat: number;
  bestIndex?: number | null;
  cardScale?: CardScale;
  isInstant?: boolean;
};
