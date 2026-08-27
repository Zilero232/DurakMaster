import type { TableSettings, ViewForGame } from '@durak-master/schemas';

import type { Chatter } from '@/entities/game-table';
import type { OnlineGame } from '@/entities/session';

export type DurakTableProps = {
  game: OnlineGame;
  settings: TableSettings;
  view: ViewForGame<'durak'>;
  phrases: Record<string, Chatter>;
  isWaiting: boolean;
  onLeave: () => void;
};
