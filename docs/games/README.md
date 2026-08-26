# Game rules

The source of truth for `packages/game-core`. Each document formalizes one game
so that the rules carry over into code without guesswork: where sources
disagree, that is stated explicitly along with the chosen variant.

**Read before any edit to the rules.** Bugs in game logic are the most expensive
ones in the project: players notice them, not tests.

| Game | Document | Rules | Table screen |
|---|---|---|---|
| Durak | [durak.md](./durak.md) | implemented | implemented |
| Burkozel | [burkozel.md](./burkozel.md) | implemented | — |
| Kozel | [kozel.md](./kozel.md) | implemented, [tested](../../packages/game-core/src/kozel) | — |
| Tysyacha | [tysyacha.md](./tysyacha.md) | described | — |

A game with implemented rules is playable through `game-core` and appears in the
lobby, but until its table screen exists the client shows a placeholder.

How the multi-game setup works — [architecture.md](./architecture.md): how four
games live in one app without turning `game-core` into a dump of conditionals.

## What is shared

All four games share one skeleton in `packages/game-core`:

- deck, shuffle, rank comparison — `deck.ts`
- cryptographic randomness arrives from outside as the `randomInt` parameter
- state changes only through the pure function `(state, action) => state`
- a player sees a `PlayerView`, not a `GameState` — other players' hands and the
  deck order never leave the server

What differs is the rules of the turn, tricks and scoring. What is shared goes into
`game-core/shared`, what is specific goes into the game module.

## How to add a game

1. Write the rules document in this folder, following the existing ones.
2. Describe the table settings: which modes the player picks in the lobby.
3. Implement `game-core/<game>` — the rules as pure functions, plus a
   `<game>Module` registered in `registry.ts`.
4. Cover the document's bug checklist with tests (`bun test`). The checklist at
   the end of each rules document is written to be turned into test names.
5. Add the game's rules to the lobby form: a `<Game>Settings` component and an
   arm in the `GameSettings` dispatcher.
6. Add the table screen: layout and actions.

The first two steps are mandatory before any code. Implementing rules that are not
on paper leads to arguments with players that there is no way to settle.

**Games that run over several deals** (kozel, burkozel, tysyacha) finish a deal in
the middle of a session and must deal again. A reducer stays pure and has no
randomness, so the module exposes `startNextDeal(state, randomInt)` instead and
the server calls it after every accepted action.
