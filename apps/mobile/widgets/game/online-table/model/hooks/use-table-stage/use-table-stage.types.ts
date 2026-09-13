import type { GameId, TableSettings } from '@durak-master/schemas';

export type TableStage =
  | { kind: 'absent' }
  | { kind: 'game'; game: GameId; settings: TableSettings }
  | { kind: 'unsupported'; game: GameId };
