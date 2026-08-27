import type {
  ActionForGame,
  GameErrorCode,
  GameId,
  SettingsForGame,
  StateForGame,
  ViewForGame
} from '@durak-master/schemas';

export type CreateGameInput<G extends GameId> = {
  tableId: string;
  settings: SettingsForGame<G>;
  userIds: string[];
  randomInt: (maxExclusive: number) => number;
};

export type ReduceResult<G extends GameId> =
  { ok: false; error: GameErrorCode } | { ok: true; state: StateForGame<G> };

export type GameModule<G extends GameId> = {
  id: G;
  minPlayers: number;
  maxPlayers: number;

  createGame: (input: CreateGameInput<G>) => StateForGame<G>;
  reduce: (
    state: StateForGame<G>,
    userId: string,
    action: ActionForGame<G>['action']
  ) => ReduceResult<G>;
  toPlayerView: (state: StateForGame<G>, userId: string) => ViewForGame<G>;
  decideBotAction: (state: StateForGame<G>, userId: string) => ActionForGame<G>['action'];
  decideTimeoutAction: (state: StateForGame<G>, userId: string) => ActionForGame<G>['action'];

  /**
   * Games played over several deals (kozel, burkozel, tysyacha) end a deal in
   * the middle of a session: the scoreboard moves and the cards must be dealt
   * again. `reduce` cannot do it — shuffling needs randomness, and randomness
   * stays outside a pure reducer — so the host asks the module afterwards.
   *
   * Returns the state of the next deal, or `null` when nothing is pending
   * (the deal is still running, or the whole game is over). Single-deal games
   * such as durak leave the hook out.
   */
  startNextDeal?: (
    state: StateForGame<G>,
    randomInt: (maxExclusive: number) => number
  ) => StateForGame<G> | null;
};
