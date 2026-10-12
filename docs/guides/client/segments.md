# The `model/`, `lib/` and `api/` segments

Part of the [style guide](../README.md).

## 11. The `model/`, `lib/`, `api/` segments

**`model/`** — hooks, Zustand store, form schemas, state types.

```text
entities/session/model/
  index.ts
  hooks/
    use-online-game/      ← a hook on top of the store
    use-game-seat/
  store/
    session-store/        ← Zustand: connection, table, game view
```

```text
features/lobby/create-table/model/
  index.ts                ← barrel
  create-table-form.ts    ← the form's zod schema, defaults, mapper into TableSettings
  hooks/
    use-create-table-form/
```

Files are kebab-case. Functions inside are camelCase.

**A subsystem → a folder.** Provider + context + hook (or a hook + 2 or more modules used only by it) → a separate folder with an `index.ts`. A store split across files lives the same way: `session-store/` holds `session-store.ts` plus its `.types.ts`, `.config.ts`, `.reduce.ts`, `.connection.ts` and `.profile-cache.ts`, and its `index.ts` exports only the store and its public types.

**Grouping inside `model/`.** When a slice has many `model` files, group them into subfolders by nature (`model/contexts/`, `model/hooks/`, `model/store/`). This is organization **inside** the `model/` segment, not a separate top-level `hooks/` segment (that one is forbidden, see below).

**The `model/` barrel rule.** Every `model/` subfolder gets its own `index.ts`. A slice-level `model/index.ts` re-exports what goes outside — from a flat file (`create-table/model/index.ts` re-exports `create-table-form.ts`) and from the subfolder barrels (`./hooks`). Inside the slice, an import goes through the subfolder's barrel:

```ts
// ✓ OK
import { useTableStage } from '../model/hooks';
import { CREATE_TABLE_DEFAULTS } from '../model';

// ✗ NOT OK
import { useTableStage } from '../model/hooks/use-table-stage/use-table-stage'; // deep, bypassing the barrel
```

Between files **within the same subfolder** — a relative import by file (`./use-x`, `../types`), not through its own barrel (a self-import). `model/types.ts` is a file, not a folder: it is imported directly as `../model/types`.

**Types:**

- Local types of a single hook (`Props`, input/output, internal unions) — in the hook folder's `.types.ts` ([`model/hooks` structure](model-hooks.md) §2.2).
- Public types of the slice (used by other slices through the barrel) — in `model/types.ts` or next to the store they are re-exported from (`ConnectionStatus`, `GameOutcome` in `session-store.types.ts`).
- If a subsystem folder has its own internal types — `model/<subsystem>/<subsystem>.types.ts`.

Do not create a separate `types/` or `hooks/` segment — that is a split by the file's shape rather than by the nature of the code (an FSD antipattern).

**`lib/`** — pure functions with no React dependencies:

```text
widgets/lobby/table-list/lib/     ← the slice's own helpers

shared/lib/
  cards/            ← cardKey — a card's identity, re-exported from game-core
  feedback/         ← PRESS_FEEDBACK — sound + vibration on a press
  format/           ← formatting of amounts and time
  games/durak/      ← getPlayableKeys / getBeatableIndexes, canTransferCard, seatCalls
  haptics/          ← a wrapper over expo-haptics
  sound/            ← playback through expo-audio
  stats/            ← win rate
```

React hooks that are project-agnostic are not `lib/` — they live in `shared/model/` (`time/` — `useNow`, `useCountTo`; `preferences/`).

**Rules of one game go to `shared/lib/games/<game>/`**, not into an entity. They are pure functions over that game's `PlayerView`, several layers read them, and a per-game folder keeps future rule sets from growing into each other.

**Card helpers are split by nature, not duplicated.** `cardKey` is identity — React keys, looking a card up in a hand — so it is `shared/lib/`, where the game layers use it. `rankLabel` / `suitColor` are how a card is _drawn_; they live in `ui-kit/theme/` and go outside from `@/ui-kit`. This is what keeps `ui-kit` free of `@/` imports ([slice `ui/` and `ui-kit`](slice-ui.md) §2.1): the design system owns its rendering helpers instead of borrowing them from `shared`.

If a function returns JSX — it is a component, move it into `ui/`.

**Heuristic for `lib/` vs `model/`:** the function uses React (`useState`, `useEffect`, a store) → `model/`. Pure (takes arguments, returns a value) → `lib/`. An error class, parsers, mappers — `lib/`. A set of setting values/constants — `config/`.

**`api/` in a slice** — integration with the server tied to the slice's domain: HTTP calls, the TanStack Query hooks over them, mappers. The difference from `model/` is that `api/` is the I/O boundary (network, realtime, push service), while `model/` is hooks and state types.

```text
entities/social/api/
  social-api.ts       ← fetchFriends, requestFriend, … + the query keys
  use-friends.ts      ← useQuery / useMutation over them
  index.ts
```

Heuristic: code that **listens to / sends to** an external service → `api/`. Code that **reads/derives** domain state → `model/`. A project-agnostic client (not tied to a domain) → `shared/api/` (below).

**`api/` in `shared/`** — clients of external services:

```text
shared/api/
  auth/      ← better-auth client (authClient, useSession, signOut, getAuthToken)
  http/      ← httpClient — axios with the bearer token attached
  query/     ← queryClient — the TanStack Query defaults
  socket/    ← WebSocket client on React Native's WebSocket: auth header, reconnection
  index.ts
```

**The socket carries realtime, HTTP carries everything else.** Lobby, table and game traffic goes over the socket: the server is authoritative, the table state lives in node memory and arrives as pushes. Profile, friends, achievements and the leaderboard are request/response, so they go over `httpClient` and TanStack Query. The reasoning is in [`docs/architecture/realtime.md`](../../architecture/realtime.md).

```ts
import type { GameAction } from '@durak-master/schemas';

import { socketClient } from '@/shared/api';

export const sendGameAction = (action: GameAction, expectedVersion: number) => {
  socketClient.send({ type: 'game:action', payload: { action, expectedVersion } });
};
```

Incoming messages are validated by `serverMessageSchema` from `@durak-master/schemas` — the same contract the server builds them with.
