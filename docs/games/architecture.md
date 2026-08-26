# Multi-game: how it works

How four games live in one app without turning `game-core` into a dump of
conditionals. Read before adding a new game.

---

## 1. What is shared and what is specific

Shared by all four games:

| Shared | Where |
|---|---|
| Deck, shuffle, rank comparison | `game-core/shared/deck.ts` |
| Table, seats, connections, state version | `GameCoreState` in the schemas |
| Lobby, bets, privacy, turn timer | `TableSettings.common` |
| Socket, broadcast, snapshots, bot skeleton | `apps/server` — knows nothing about games |
| Cards, fanned hand, discard pile, avatars | `ui-kit` |

Specific to each game:

| Specific | Example of divergence |
|---|---|
| Shape of the state | Durak has `attackerSeat`/`defenderSeat`, Kozel has tricks and pair scores |
| Set of actions | `attack`/`defend` versus `playCard`/`bid`/`declareMarriage` |
| Rules of the turn | Durak beats with a higher card, Tysyacha must follow suit |
| Scoring | Durak — whoever is left holding cards, Tysyacha — points up to 1000 |
| Table settings | Tysyacha has no deck size, Kozel has no throwing in |

## 2. State

`GameState` stops being a flat object with Durak's fields and becomes a union
discriminated by game:

```ts
type GameCoreState = {
  tableId: string;
  players: PlayerState[];
  activeSeat: number;
  phase: GamePhase;
  turnDeadline: number | null;
  version: number;
};

type GameState =
  | (GameCoreState & { game: 'durak'; rules: DurakRules; ...durak fields })
  | (GameCoreState & { game: 'burkozel'; rules: BurkozelRules; ...burkozel fields })
  | (GameCoreState & { game: 'kozel'; rules: KozelRules; ...kozel fields })
  | (GameCoreState & { game: 'tysyacha'; rules: TysyachaRules; ...tysyacha fields });
```

The server works **only with `GameCoreState`**: it broadcasts, counts versions and
watches the timer. It does not look into a specific game's fields — otherwise every
new game would require changes to the transport.

> **Pitfall.** The temptation to make one wide state with optional fields
> (`attackerSeat?`, `tricks?`, `bids?`) is strong, but that loses the main thing: the
> type stops answering the question "is this action allowed right now". The checks
> move into runtime, and a forgotten branch is discovered by a player rather than by
> the compiler.

## 3. Actions

Same thing: `GameAction` is a union by game. An action always belongs to one game;
there is no such thing as an action "in general".

```ts
type GameAction =
  | { game: 'durak'; type: 'attack'; card: Card }
  | { game: 'burkozel'; type: 'playCards'; cards: Card[] }
  | { game: 'kozel'; type: 'playCard'; card: Card }
  | { game: 'tysyacha'; type: 'bid'; value: number }
  | ...;
```

Validation stays on the server, as before: an action is checked against the state
**before** it is applied, and `expectedVersion` guards against races.

## 4. Table settings

Split into common settings and game rules:

```ts
type TableSettings = {
  game: GameId;
  maxPlayers: number;
  bet: number;
  isPrivate: boolean;
  speed: GameSpeed;
  turnTimeoutSeconds: number;
  rules: DurakRules | BurkozelRules | KozelRules | TysyachaRules;
};
```

`rules` differs by `game`. This is not cosmetic: Tysyacha's deck is always 24, and a
flat `deckSize: 24 | 36 | 52` would allow creating a table the rules do not support.

Each game describes its own modes declaratively — as a list of settings with options.
The table creation screen is assembled from that description instead of being written
from scratch for every game.

## 4.1. How the schemas are laid out

```text
packages/schemas/src/game/
  core/                    everything shared, nothing game-specific
    card.ts                cards, suits, ranks, deck sizes
    player.ts              GameCoreState, PlayerState, GamePhase
    game-id.ts             GameId, player ranges
    state.ts               GameState and PlayerView unions
    action.ts              GameAction union, error codes
    table-settings-common.ts
    table-settings.ts      TableSettings union
    index.ts
  games/
    durak/
      rules.ts             DurakRules — what the lobby offers
      state.ts             DurakState, DurakView
      action.ts            DurakAction
      index.ts
    burkozel/  kozel/  tysyacha/    same three files each
    index.ts
  index.ts
```

**A game's rules live next to its state, not in a settings folder of their own.**
`DurakRules` and `DurakState` change together — a new mode almost always adds a
field to both. Keeping them apart means editing two distant folders for one
change, and it is how the earlier layout drifted into a mess.

`core/` never imports from `games/` except in the two union files (`state.ts`,
`action.ts`, `table-settings.ts`) — those exist precisely to assemble the unions.
A game module imports from `core/`, never from a sibling game.

## 5. Game module

Every game implements the same interface:

```ts
type GameModule<G extends GameId> = {
  id: G;
  minPlayers: number;
  maxPlayers: number;

  createGame(input: CreateGameInput<G>): StateForGame<G>;
  reduce(state, userId, action): ReduceResult<G>;
  toPlayerView(state, userId): ViewForGame<G>;
  decideBotAction(state, userId): ActionForGame<G>['action'];
  decideTimeoutAction(state, userId): ActionForGame<G>['action'];

  // Optional: only for games played over several deals.
  startNextDeal?(state, randomInt): StateForGame<G> | null;
};
```

The server keeps a registry `Record<GameId, GameModule>` and calls the right one by
`settings.game`. Adding a game is a new entry in the registry; the transport does not
change.

**A timeout is an action, not a separate state transition.** The module says which
action to take (`decideTimeoutAction`) and it goes through the same `reduce` as a
real move — that keeps a single validation path and one place where state changes.

**`startNextDeal` is how a multi-deal game deals again.** Durak ends with the game;
kozel, burkozel and tysyacha end a *deal* and carry a scoreboard across many of
them. Dealing needs a shuffle, a shuffle needs randomness, and randomness has no
place in a pure reducer — so `reduce` marks the deal finished and the server, which
owns `randomInt`, calls this hook right after committing an action.

## 6. Order of work

1. **Split the schemas** — `GameCoreState`, the state and action unions.
2. **Split `game-core`** — `shared/` and a module per game, Durak moves over as is.
3. **Registry on the server** — `game-room` stops importing Durak directly.
4. **Lobby** — game selection, a settings form built from the mode descriptions.
5. **Games one at a time** — Burkozel, Kozel, Tysyacha.

The first three steps add no games at all, but without them every next one costs more.
Burkozel is done first precisely as a check: it is close to Durak, so if the skeleton
leaks somewhere, it shows on a small game.

## 7. What must not change

The invariants from `CLAUDE.md` apply to all games:

- randomness is server-side and cryptographic only;
- the deck order and other players' hands do not reach the client;
- the server is authoritative, `expectedVersion` guards against races;
- `game-core` imports nothing except `@durak-master/schemas`.

The last point matters especially during the split: a game module must know nothing
about the socket or the database.
