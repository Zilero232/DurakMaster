import type { TableSettings } from '@durak-master/schemas';

import type { Chatter } from '@/entities/game-table';
import type { OnlineGame } from '@/entities/session';

import type { useDurakTable } from '../model';

export type CreateTableValueInput = {
  game: OnlineGame;
  table: ReturnType<typeof useDurakTable>;
  settings: TableSettings;
  phrases: Record<string, Chatter>;
  isWaiting: boolean;
};
