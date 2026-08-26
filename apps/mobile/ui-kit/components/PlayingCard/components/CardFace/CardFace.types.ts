import type { Card } from '@durak-master/schemas';

import type { CardTheme } from '../../../../theme';

export type CardFaceProps = {
  card: Card;
  width: number;
  theme: CardTheme;
};
