import type {
  Card,
  DurakRules,
  DurakState,
  PlainCard,
  PlayerState,
  Rank,
  Suit,
  TablePair
} from '@durak-master/schemas';

import { DEFAULT_DURAK_RULES } from '@durak-master/schemas';

type BuildStateInput = Partial<Omit<DurakState, 'hands' | 'players' | 'rules'>> & {
  hands: Record<string, Card[]>;
  rules?: Partial<DurakRules>;
};

export const card = (rank: Rank, suit: Suit): PlainCard => ({ kind: 'plain', rank, suit });

export const pair = (attack: Card, defense: Card | null = null): TablePair => ({
  attack,
  defense,
  attackSeat: 0,
  defenseSeat: defense ? 1 : null
});

export const buildState = ({ hands, rules, ...overrides }: BuildStateInput): DurakState => {
  const players: PlayerState[] = Object.entries(hands).map(([userId, hand], seat) => ({
    userId,
    seat,
    handCount: hand.length,
    isOut: false,
    outPlace: null,
    isDisconnected: false
  }));

  return {
    game: 'durak',
    rules: { ...DEFAULT_DURAK_RULES, ...rules },
    tableId: 'table',
    phase: 'playing',
    isTaking: false,
    players,
    hands,
    talon: [],
    trump: 'spades',
    trumpCard: null,
    table: [],
    discard: [],
    attackerSeat: 0,
    defenderSeat: 1,
    activeSeat: 0,
    attackLimit: 6,
    passedSeats: [],
    shownTrumpSeats: [],
    turnDeadline: null,
    loserUserId: null,
    isDraw: false,
    version: 0,
    ...overrides
  };
};
