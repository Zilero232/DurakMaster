import type { ViewForGame } from '@durak-master/schemas';

export type UseTableSoundsInput = {
  view: ViewForGame<'durak'> | null;
  isMyTurn: boolean;
};
