import type { BoostId, Card, MyProfile, QuickPhraseId, TauntId } from '@durak-master/schemas';

import type { Chatter, DropZone } from '@/entities/game-table';
import type { HandSort } from '@/entities/settings';

import type { PrimaryAction } from '../lib/pick-primary-action.types';
import type { TurnStatus } from '../lib/pick-turn-status.types';

export type TableLook = {
  hasHints: boolean;
  sortMode: HandSort;
  isInstant: boolean;
};

export type TableTurn = {
  isMyTurn: boolean;
  isWaiting: boolean;
  isReady: boolean;
  hasFreeSeat: boolean;
  primaryAction: PrimaryAction | null;
  status: TurnStatus | null;
  canUndo: boolean;
  boosts: BoostId[];
  turnSeconds: number;
  playableKeys: Set<string>;
  selectedKey: string | null;
};

export type TableDrag = {
  dropZones: DropZone[];
  onDropOn: (card: Card, pairIndex: number) => void;
  onDropMiss: (card: Card, travelY: number) => void;
  onZonesChange: (zones: DropZone[]) => void;
  onHover: (index: number | null) => void;
  onDragStart: (card: Card) => void;
  onDragEnd: () => void;
};

export type TableMoves = {
  onSelectCard: (card: Card) => void;
  onPrimaryAction: () => void;
  onAddBot: () => void;
  onSendPhrase: (phraseId: QuickPhraseId) => void;
  onSendEmoji: (emoji: TauntId) => void;
  onUseBoost: (boost: BoostId) => void;
};

export type TableContextValue = {
  profile: MyProfile | null;
  chatter?: Chatter;
  look: TableLook;
  turn: TableTurn;
  drag: TableDrag;
  moves: TableMoves;
};
