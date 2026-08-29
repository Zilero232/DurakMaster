import type {
  BoostId,
  Card,
  GameErrorCode,
  LobbyTable,
  PlayerView,
  PublicProfile,
  QuickPhraseId,
  TablePhrase,
  TableSettings,
  TauntId
} from '@durak-master/schemas';

export type ConnectionStatus = 'connected' | 'connecting' | 'error' | 'idle';

export type GameOutcome = {
  loserUserId: string | null;
  isDraw: boolean;
  creditsDelta: number;
  ratingDelta: number;
};

export type TableEmoji = { emoji: TauntId; at: number };

export type SessionState = {
  status: ConnectionStatus;

  isLobbySubscribed: boolean;

  tables: LobbyTable[];
  currentTable: LobbyTable | null;
  mySeat: number | null;

  view: PlayerView | null;
  tablePlayers: PublicProfile[];
  outcome: GameOutcome | null;

  phrases: TablePhrase[];
  emojis: Record<string, TableEmoji>;

  lastErrorCode: string | null;
  lastError: string | null;
  rejectedCode: GameErrorCode | null;
  revealed: RevealedCards | null;

  selectedTableCardKey: string | null;
};

export type RevealedCards = {
  boost: BoostId;
  cards: Card[];
  targetUserId: string | null;
};

export type SessionActions = {
  selectTableCard: (key: string | null) => void;

  connect: () => Promise<void>;
  disconnect: () => void;

  subscribeLobby: () => void;
  createTable: (settings: TableSettings, password?: string) => void;
  joinTable: (tableId: string, password?: string) => void;
  leaveTable: () => void;
  setReady: (isReady: boolean) => void;
  addBot: () => void;
  applyBoost: (boost: BoostId, targetUserId?: string) => void;
  clearRevealed: () => void;

  sendPhrase: (phraseId: QuickPhraseId) => void;
  sendEmoji: (emoji: TauntId) => void;

  clearOutcome: () => void;
  clearRejection: () => void;
  clearError: () => void;
};

export type SessionStore = SessionActions & SessionState;
