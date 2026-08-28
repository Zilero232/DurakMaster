import type { BoostId, Card, MyProfile, QuickPhraseId, TauntId } from '@durak-master/schemas';

import type { Chatter, DropZone } from '@/entities/game-table';
import type { CardScale, HandSort } from '@/entities/settings';

export type TableLook = {
  hasHints: boolean;
  sortMode: HandSort;
  cardScale: CardScale;
  isInstant: boolean;
};

export type TableTurn = {
  isMyTurn: boolean;
  isWaiting: boolean;
  isReady: boolean;
  isLoser: boolean;
  hasFreeSeat: boolean;
  canPass: boolean;
  canTake: boolean;
  canUndo: boolean;
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
  onPass: () => void;
  onTake: () => void;
  onReady: (isReady: boolean) => void;
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
