import type { BoostId, Card, MyProfile, QuickPhraseId, ViewForGame } from '@durak-master/schemas';

import type { DropZone } from '@/entities/game-table';
import type { CardScale, HandSort } from '@/entities/settings';

export type PlayerZoneProps = {
  view: ViewForGame<'durak'>;
  profile: MyProfile | null;
  chatter?: string;

  turnSeconds: number;
  isMyTurn: boolean;
  hasHints: boolean;
  sortMode: HandSort;
  cardScale: CardScale;
  isInstant: boolean;
  dropZones: DropZone[];
  playableKeys: Set<string>;
  selectedKey: string | null;
  canPass: boolean;
  canTake: boolean;
  onSelectCard: (card: Card) => void;
  onPass: () => void;
  onTake: () => void;
  onSendPhrase: (phraseId: QuickPhraseId) => void;
  onSendEmoji: (emoji: string) => void;
  onUseBoost: (boost: BoostId) => void;
  onLeave: () => void;
  onDropMiss: (card: Card) => void;
  onDropOn: (card: Card, pairIndex: number) => void;
  onHover: (index: number | null) => void;
  onDragStart: (card: Card) => void;
  onDragEnd: () => void;
};
