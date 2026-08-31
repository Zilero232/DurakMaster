# Feature-Sliced Design — DurakMaster

The FSD methodology for `apps/mobile/`. This document is a working reference on the client architecture: layer hierarchy, import rules, public APIs, segments.

Full specification: [feature-sliced.design](https://feature-sliced.design). Linter for FSD rules: [Steiger](https://github.com/feature-sliced/steiger).

> **Deviations from canonical FSD in this project** (deliberate, see the reasons below):
>
> | Canonical FSD | DurakMaster | Why |
> |---|---|---|
> | Root `src/` | Layers sit directly in `apps/mobile/`, alias `@/` → `apps/mobile/` | A single structure shared with the company's other clients: an extra `src/` level carries no meaning, and imports are shorter — `@/ui-kit`. |
> | `pages/` layer | `views/` layer | The name `pages` is already taken by the meaning "route screen" in Expo Router; `views/` does not get confused with the `app/` directory. |
>
> Everywhere below, where the canon says `pages` or `src/pages` — we have `views`. Where it says `src/` — we have the `apps/mobile/` root.

---

## 1. Layer hierarchy (top down)

| # | Layer | Purpose | Slices? |
|---|---|---|---|
| 1 | App | Expo Router routes, providers, entrypoint | No |
| 2 | Views *(canon: Pages)* | Whole screens / route-level compositions | Yes |
| 3 | Widgets | Large self-contained UI blocks (reusable or independent) | Yes |
| 4 | Features | User interactions with business value (forms, actions) | Yes |
| 5 | Entities | Core business concepts (session, settings, game-table) | Yes |
| 6 | Shared | Socket client, utilities, i18n, config, bridge to native — project-agnostic | No |
| — | UI-kit | Design system: primitives, composite components, icons, tokens | No |

The `Processes` layer is deprecated — its contents move into `Features` or `App`.

`UI-kit` is outside the numbering: it is not built into the chain, it lies **beneath** it. Any layer
may import it — from `App` down to `Shared`; it imports none of them (see §2).

### Directory structure

```
apps/mobile/
├── app/                # App layer — Expo Router routes directory
│   ├── _layout.tsx     # re-export of views/root-layout
│   ├── index.tsx       # the app's only screen
│   └── +not-found.tsx  # nonexistent route
├── views/              # Views layer (canon: pages/)
│   └── <view-name>/
├── widgets/            # Widgets layer
│   └── <domain>/       # game | lobby | profile | rules | social
│       └── <widget-name>/
├── features/           # Features layer
│   └── <domain>/       # auth | game | lobby | settings
│       └── <feature-name>/
├── entities/           # Entities layer
│   └── <entity-name>/
├── shared/             # Shared layer (no slices — segments only)
│   ├── api/            # better-auth client, WebSocket client
│   ├── config/         # env, server address
│   ├── i18n/           # i18next, locales, key typing
│   ├── lib/            # format, haptics, sound, time
│   ├── model/          # layout, preferences, clock
│   └── platform/       # bridge to @durak-master/platform
└── ui-kit/             # Design system (no slices — segments only)
    ├── primitives/     # basic: Button, Avatar, Sheet
    ├── components/     # composite: PlayingCard, StatusScreen
    ├── icons/          # SuitIcon
    └── theme/          # tokens, screen-derived sizes, deck themes
```

> **Domain grouping of slices.** In DurakMaster, slices inside `features/` and `widgets/` are grouped by business domain (`auth`, `game`, `lobby`, `profile`). This is a layer on top of the FSD canon (`<layer>/<slice>/`). Imports: `@/features/auth/sign-in`, `@/widgets/lobby/table-list`. The `entities/` layer is still flat — there are few slices (`session`, `settings`, `game`), and a domain layer would be redundant.

### The `app/` directory — routes only

**Expo Router treats any file in `app/` as a route.** An `AppShell.styles.ts` or `AppShell.types.ts` placed next to a route turns into a `/AppShell.styles` screen, and `_layout.tsx` will try to render it.

That is why `app/` contains **only** route files: `_layout.tsx`, `index.tsx`, `+not-found.tsx`. No `.styles.ts`, `.types.ts`, `components/` or helpers. Everything else goes into the layers next to `app/` — including the layout itself, which lives as a full slice in `views/root-layout` and reaches the route as a one-line re-export:

```tsx
// app/_layout.tsx — the whole file
import { RootLayout } from '@/views/root-layout';

export default RootLayout;
```

See §6 for what the slice holds.

---

## 2. The golden rule: direction of imports

```
App → Views → Widgets → Features → Entities → Shared
 └──────┴────────┴──────────┴───────────┴──────────┴──→ UI-kit
```

A module imports only from layers **strictly below**. Forbidden:

- **Upward** — a Feature cannot import from a Widget or a View.
- **Sideways within a layer** — one Feature cannot import another Feature.

**`ui-kit` is a terminal layer.** Everyone imports it, it imports no one:

- Any layer may import `@/ui-kit` — this does not count as "sideways" and does not violate the direction.
- `ui-kit` **imports neither `@/shared`, nor `@/entities`, nor any other layer** — not a single `@/` import except its own. From the outside it has only npm packages (`react-native`, `react-native-svg`, `lucide-react-native`, `react-i18next`, …) and the card types from `@durak-master/schemas`.
- What `ui-kit` needs from the app arrives **from above through context**, not through an import (see §5.1).

The rule is one-directional not for the sake of purity: the moment a primitive pulls in `@/entities`, the design system stops being portable and any import of it starts dragging the store and the socket along.

**Exception — cross-entity references.** When Entity A needs a type from Entity B, use the `@x` pattern: `entities/A/@x/B.ts` exports only what B needs from A.

---

## 3. Slices

A slice is a directory inside a layer, named after a **business domain** (not a technical role).

- ✓ Good: `session`, `settings`, `table-list`, `create-table`, `sign-in`
- ✗ Bad: `components`, `hooks`, `helpers`, `utils`

**Rules:**

- Every slice is isolated — zero coupling with neighbouring slices of the same layer.
- Related slices may be grouped into subfolders, but they remain independent.
- Slice names are kebab-case.

**Domain groups (DurakMaster):** the `features/` and `widgets/` layers group slices by business domain:

- `auth/` — sign in and sign up (`sign-in`)
- `game/` — the course of a round (`durak-table`, `online-table`, `match-result` as widgets; `table-emojis` as a feature). The reusable parts of a table — hand, felt, talon, timer, result — are an entity (`entities/game-table`), not a widget: every game composes them, so they must sit below the widget layer.
- `lobby/` — table list, creating and joining a table (`table-list`, `create-table`, `join-table`)
- `profile/` (widgets only) — wallet, profile menu
- `settings/` (features only) — settings panel
- `rules/` (widgets only) — rules panel
- `social/` (widgets only) — friends, achievements, leaderboard

A domain folder is an organizational container, **not a public API**. An import always goes down to the slice level: `@/features/lobby/create-table`, not `@/features/lobby`.

---

## 4. Segments

Segments organize the code inside a slice by technical purpose:

| Segment | Contains |
|---|---|
| `ui/` | Components, their styles and types |
| `model/` | Types, Zustand stores, form schemas, hooks, business logic |
| `api/` | Requests and subscriptions to the server, data mappers |
| `lib/` | Internal utilities for this slice only |
| `config/` | Feature flags, constants, configuration |

Custom segments are allowed — name them after **what they do**, not what they are.
✗ Bad: `hooks/`, `components/`. ✓ Good: `model/`, `lib/`.

---

## 5. Public API (`index.ts`)

Every slice has an `index.ts` at its root re-exporting the public interface.

```ts
// entities/session/index.ts
export { sendGameAction, useSessionStore } from './model/session-store';
export { useOnlineGame } from './model/use-online-game';
export { SessionNotices } from './ui/SessionNotices';

export type { ConnectionStatus, GameOutcome } from './model/session-store';
```

**Rules:**

- **No wildcard exports** — `export * from './ui/Foo'` is forbidden. Be explicit.
- **Minimal surface** — export only what other layers actually need.
- **External imports go only through the slice index** — never `@/features/auth/sign-in/ui/SignInForm` directly. Always `@/features/auth/sign-in`.
- **A domain group is not a public API** — `@/features/auth` does not exist, a specific slice is imported. The domain folder only organizes files.
- **`model/` — a barrel where there is something to hide.** A flat `model/` of one or two files is imported per file (`./model/session-store`). Once subfolders appear inside `model/`, each gets a barrel (`model/hooks/index.ts`, `model/contexts/index.ts`), and we do not create a slice-level `model/index.ts`. More detail — [`docs/style.md`](./style.md) §11.
- **No circular imports** — do not import from your own `index.ts` inside the slice. Inside, use relative paths.
- **`ui-kit/` — the design system, a separate layer next to `shared/`.** Segments: `primitives/` (basic), `components/` (composite), `icons/`, `lib/` (utilities and contexts of the layer), `theme/` (tokens, screen-derived sizes, deck themes). **Every component gets its own PascalCase folder** (`primitives/Button/`, `components/PlayingCard/`, …) with the files `Component.tsx`, `Component.styles.ts`, optionally `Component.types.ts`, and a mandatory `index.ts` barrel. Segment barrels (`primitives/index.ts`, …) and the root `ui-kit/index.ts` re-export everything. From the outside — only `@/ui-kit`, not `@/ui-kit/primitives/Button`. Primitives are assembled from `react-native` (`View`, `Pressable`, `Text`, `Modal`); styles use `StyleSheet.create`, tokens come from the layer's own `theme/`. More detail — [`docs/style.md`](./style.md) §2.1.

### 5.1. `ui-kit` contexts — how the layer gets data without importing layers

`ui-kit` cannot read a Zustand store or call `@/shared/lib/sound`: that would be an upward import (§2). But it also must not draw a deck without a selected theme, or a button without a click. The way out is **dependency inversion through context**: `ui-kit` declares a provider and a hook, and the app supplies the value from above.

Both contexts are built on `createContext` from `@siberiacancode/reactuse` and are exported from `@/ui-kit`:

| Context | Provider / hooks | Who supplies the value |
|---|---|---|
| Deck theme | `CardThemeProvider`, `useCardTheme`, `useSetCardTheme` | `views/root-layout` — `initialValue` from the settings store |
| Press feedback | `FeedbackProvider`, `usePressFeedback` | `views/root-layout` — sound + vibration from `shared/lib` |

```tsx
// views/root-layout/config/press-feedback.ts — the app knows about the sound, ui-kit knows nothing
export const PRESS_FEEDBACK = {
  onPress: () => {
    unlockSound();
    playSound('click');
    haptic('tap');
  }
};

// views/root-layout/ui/components/AppProviders/AppProviders.tsx
<FeedbackProvider initialValue={PRESS_FEEDBACK}>
  <CardThemeProvider initialValue={cardTheme}>{children}</CardThemeProvider>
</FeedbackProvider>;
```

What each one buys:

- **`usePressFeedback`** — `Button` calls it in `onPress` and produces a click with vibration, knowing nothing about `expo-audio` and `expo-haptics`. The default is a noop, so the primitive renders even without a provider (tests, Storybook).
- **`useCardTheme`** — `PlayingCard` takes the card back from the context instead of reading `useSettingsStore`. The source of truth stays in `entities/settings` (that is where persistence lives), and the context is only its projection for rendering, which is why `SettingsPanel` calls **both** the store **and** `useSetCardTheme` when the theme changes.

The rule: **a new dependency of `ui-kit` on the app is a new context, not a new import.** If a primitive needs something from the business layers, declare the provider next to the component that consumes it (`ui-kit/primitives/Button/feedback-context.ts`, `ui-kit/components/PlayingCard/card-theme-context.ts`) and supply the value in `views/root-layout`.

---

## 6. Integration with Expo Router

`app/` is the routes directory, and **a route file holds nothing but the re-export** — no markup, no hooks, no providers. Every screen, the root layout included, is a slice in `views/`:

```tsx
// app/index.tsx — the whole file
import { HomeScreen } from '@/views/app-shell';

export default HomeScreen;
```

| Route | Slice |
|---|---|
| `app/_layout.tsx` | `views/root-layout` |
| `app/index.tsx` | `views/app-shell` |
| `app/+not-found.tsx` | `views/not-found` |

Route files are the **only place with `export default`**: Expo Router requires exactly that, otherwise the screen is not found. Everything else in the project is exported by name — including the component behind the route, which the slice exports by name and the route file re-exports as the default.

The reason is the one from §1: anything placed next to a route becomes a route itself. A screen that lives in the route file has nowhere to put its styles, its types or its subcomponents, so it either stays a single bloated file or leaks helpers into the routing table. Kept in `views/`, it is an ordinary slice with the usual segments.

**`views/root-layout` — the app's composition root.** It is the slice that assembles everything the app needs before the first frame:

```
views/root-layout/
  index.ts                              ← export { RootLayout }
  config/
    fonts.ts                            ← the font map for useFonts
    press-feedback.ts                   ← the value for the ui-kit FeedbackProvider
  model/
    use-app-bootstrap.ts                ← fonts + locale + settings store, splash gate
  ui/
    RootLayout.tsx                      ← <AppProviders> + <Stack> + global overlays
    RootLayout.styles.ts
    components/
      AppProviders/                     ← the whole provider ladder in one component
```

`AppProviders` nests `GestureHandlerRootView`, `SafeAreaProvider`, `QueryClientProvider` and the two `ui-kit` contexts (§5.1); `RootLayout` adds `<Stack>`, `SessionNotices` and `Toaster`. A new global provider is a change inside `AppProviders` — the route file never grows.

The slice's `config/` holds only what the layout itself owns (fonts, the press-feedback value). Client instances are not layout concerns: the `QueryClient` lives in `shared/api` next to the auth and socket clients, and `AppProviders` merely hands it to the provider.

### Path aliases

`@/` points at `apps/mobile/` — the workspace root, where both the layers and `app/` live:

```jsonc
// apps/mobile/tsconfig.json
{ "compilerOptions": { "paths": { "@/*": ["./*"] } } }
```

That is why internal imports start with the layer right away: `@/ui-kit`, `@/entities/session`.

---

## 7. Composition patterns

**View** *(canon: Page)*:

```
View
├── imports Widget A (self-contained block)
├── imports Widget B
├── imports Feature X (interactive element)
└── uses `@/ui-kit` primitives for layout
```

**Widget:**

```
Widget
├── imports Feature(s) for interactivity
├── imports Entity types/components for display
└── uses `@/ui-kit` primitives
```

**Feature:**

```
Feature
├── imports Entity types/hooks for domain data
└── uses the Shared API client and utilities, `@/ui-kit` primitives
```

---

## 8. Checklist (check before every change)

- [ ] The file is in the right layer directory
- [ ] Nothing but route files has appeared in `app/`
- [ ] Imports go downward only — never upward or sideways
- [ ] The slice has a public `index.ts` with explicit named exports
- [ ] There are no direct imports into a slice's internals from the outside
- [ ] Directory and file names are kebab-case (exception — component folders: PascalCase)
- [ ] Component functions are named PascalCase exports (`export default` only in `app/`)
- [ ] Segments describe purpose (`model/`, `api/`), not a technical role (`hooks/`, `components/`)
- [ ] Route files are thin wrappers that delegate to `views/`
- [ ] The Shared layer contains no business logic — only project-agnostic code
- [ ] `ui-kit` does not import other layers — not a single `@/shared`, `@/entities`, `@/features`
- [ ] The Entities layer contains no interaction UI logic — that is the Features level

> **Naming in DurakMaster:** the FSD canon requires kebab-case for all files. The DurakMaster code style (see [`docs/style.md`](./style.md) §5): kebab-case for slices/segments, **PascalCase for component folders and files** (`GameTable/GameTable.tsx`), camelCase for hooks/utilities. This is a local convention on top of FSD.

---

## 9. Common mistakes

| Mistake | Fix |
|---|---|
| `.styles.ts` / `.types.ts` next to a route file in `app/` | Move it into a layer (`views/`, `widgets/`, …) — otherwise Expo Router turns the file into a route |
| A Feature imports from another Feature | Extract the shared logic into Entities or Shared |
| A View contains business logic directly | Extract it into a Feature, compose it in the View |
| `shared/lib/use-sign-in.ts` | Auth is a business domain → `features/auth/sign-in/model/use-sign-in.ts` |
| A Widget imports from a View | Invert it: the View imports the Widget |
| A slice exports everything through `export *` | Explicit named re-exports |
| A `components/` folder at the root of a layer | Classify it: is this a Widget, a Feature, an Entity or `ui-kit`? |
| A primitive in `ui-kit` imports `@/entities` or `@/shared` | Invert it: a provider in `ui-kit`, the value from `views/root-layout` (§5.1) |
| `import { Button } from '@/ui-kit/primitives/Button'` | Only `@/ui-kit`; if it is not in the barrel — add the line to `ui-kit/index.ts` |
| A route file contains a full screen implementation | Move it into `views/<name>/`, the route stays a thin wrapper |

---

## Additional

- Full specification: [feature-sliced.design](https://feature-sliced.design)
- Linter for FSD rules: [Steiger](https://github.com/feature-sliced/steiger)
- The `@x` cross-entity pattern — section 2 above
- DurakMaster code style on top of FSD (slice structure, naming, styles, component size): [`docs/style.md`](./style.md)
