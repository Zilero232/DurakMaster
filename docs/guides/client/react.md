# React conventions

Part of the [style guide](../README.md).

## 10. React conventions

- Function components, arrow functions.
- Markup uses `react-native` primitives: `View` instead of `div`, `Pressable` instead of `button`, `Text` for any text. Images — `Image` from `expo-image` (caching and progressive loading out of the box), not `Image` from `react-native`.
- Phones only, portrait only. No `Platform.OS === 'web'` branches, no breakpoints, no `react-native-web` — the app has no web or tablet build (`platforms: ["android", "ios"]` in `app.json`).
- The React Compiler is enabled — `useMemo`/`useCallback` are not needed for micro-optimizations. We keep them only for a semantically stable ref (`useEffect` dependencies, a key in a Map).
- Event handlers are `on<Event>` in camelCase: `onPress`, `onChangeText`, `onSelectTable`.
- Types from React are **named imports**: `import type { ComponentProps, ReactNode } from 'react'`. **`import type * as React from 'react'` is forbidden.**
- Accessibility is not optional: every pressable element has an `accessibilityRole` and, if it contains only an icon, an `accessibilityLabel`. State — `accessibilityState={{ disabled, selected }}`.

### 10.1 A component renders; a hook decides

**A component's body holds no logic beyond choosing what to render.** Anything that computes,
subscribes, schedules, measures or remembers goes into a hook in the slice's `model/hooks/`, and
the component calls that hook and lays the result out.

What has to leave a component:

- `useEffect` bodies, timers, subscriptions, listeners.
- Derived state assembled from several sources — the hook returns it ready to render.
- Imperative work: measuring, animating by hand, talking to a player or a socket.
- Branching over server state that decides _what happens_, not _what is drawn_.

What stays: JSX, the props it hands down, and the small ternaries and `&&` that pick between
already-prepared values.

```tsx
// ✗ BAD — the component owns the timer, the refs and the rules
export const TableToast = ({ view }: TableToastProps) => {
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);
  const [text, setText] = useState('');

  useEffect(() => {
    if (view.phase !== 'playing') {
      return;
    }

    setText(view.isMyTurn ? 'Your turn' : 'Waiting');
    timerRef.current = setTimeout(() => setText(''), HINT_LIFETIME_MS);

    return () => clearTimeout(timerRef.current);
  }, [view]);

  return text ? <Text>{text}</Text> : null;
};

// ✓ OK — the hook decides, the component renders
export const TableToast = ({ view }: TableToastProps) => {
  const text = useTableHint({ view });

  return text ? <Text>{text}</Text> : null;
};
```

A hook that exists to serve one component lives next to it under that slice's `model/hooks/`, in
its own folder per [`model/hooks` structure](model-hooks.md) §2.2 — not inside `components/`, and
not inline in the file.

Two things this rule does not ask for: a hook per prop, and a hook that only forwards a single
`useState`. Extract when there is logic to move, not to hit a shape.

### 10.2 Hook order

The linter does not sort hooks — we follow it by hand + catch it at review.

Group order:

1. **Navigation** — `useRouter`, `useLocalSearchParams`, `usePathname` (from `expo-router`).
2. **Localization / insets** — `useTranslation`, `useSafeAreaInsets`.
3. **Store / context** — `useSessionStore`, `useSettingsStore`, any `use<Name>Store`.
4. **Data** — `useSession`, `useMyProfile`, TanStack Query/Mutation hooks.
5. **State** — `useState`, `useReducer`.
6. **Ref / shared values** — `useRef`, `useSharedValue`.
7. **Memo / callbacks** — `useMemo`, `useCallback`, `useAnimatedProps`, `useId`.
8. **Effects** — `useEffect`, `useLayoutEffect`.
9. **Derived const** — unpacked values from hooks.

Between groups — a blank line. Within a group — none.

```tsx
export const AppShell = () => {
  const insets = useSafeAreaInsets();

  const status = useSessionStore((store) => store.status);
  const tables = useSessionStore((store) => store.tables);
  const connect = useSessionStore((store) => store.connect);

  const { data: session, isPending } = useSession();

  const [tab, setTab] = useState<ShellTab>('profile');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    if (session) {
      void connect();
    }
  }, [session, connect]);

  return <View style={styles.root}>{/* ... */}</View>;
};
```

**Reordering rules:**

- Do not move a hook with a data dependency: if a value is needed by the next hook — it must come before it. If the group order conflicts, leave it as is — the dependency wins over the group order.
- `if (...) useFoo()` is a `rules-of-hooks` bug — fix it, do not sort it.

**Zustand selectors** — one per value (`useSessionStore((store) => store.tables)`), not an object: an object selector returns a new reference on every render and re-renders the screen on any change to the store.

**Server data lives in the Query cache, not in a store.** Profile, friends, achievements and the
leaderboard come over HTTP through TanStack Query; a socket push that carries a fresh profile
writes into the cache (`queryClient.setQueryData`). A Zustand slice holding the same value is a
redundant layer to delete, not to sync. The store keeps only what Query cannot own: connection
status, the live table and game view, transient UI state.

**Custom hooks** — by the semantics of their contents: `useSession` (a query) → the Data group; `useSettingsStore` (a store) → Store; `useTableSounds` (an effect) → Effects.

### 10.3 Hook / Effect dependencies

The `deps` array of `useEffect` contains only what **should actually trigger a re-run** of the effect. If we know the effect needs a single `tableId` — we do not add `table`, `router` or mutation objects "to keep the linter quiet".

**Stable refs do not go into deps.** `router` from `expo-router`, Zustand store actions, `reset`/`mutate` from react-query are stable between renders. `react/exhaustive-deps` is a warning; `// eslint-disable-next-line react/exhaustive-deps -- <reason>` with an explicit reason is normal practice, not a hack.

```tsx
// ✗ BAD — extra deps, the mutation object changes its ref every render
useEffect(() => {
  if (!tableId) {
    router.replace('/');
  }
}, [tableId, table, router, joinMutation]);

// ✓ OK — the only trigger is tableId, the reason is recorded
// eslint-disable-next-line react/exhaustive-deps -- redirect must fire only on tableId change; router is a stable ref
useEffect(() => {
  if (!tableId) {
    router.replace('/');
  }
}, [tableId]);
```

### 10.4 Destructuring query / mutation results

The result of `useQuery` / a custom query hook is **destructured right away**; we do not carry the object around and do not reach through the dot:

```tsx
// ✗ BAD — dot access, the wrapper object is not needed
const sessionQuery = useSession();
const session = sessionQuery.data;

// ✓ OK — destructuring on the spot, renamed to something meaningful
const { data: session, isPending } = useSession();
```

`data` is almost always renamed (`data: session`) — a bare `data` carries no meaning.

**Exception — `useMutation`.** The mutation object is kept whole: both the fields (`isPending`, `isError`, `error`, `data`) and the methods (`mutateAsync`, `reset`) are needed.

General destructuring rules — [readability](../shared/readability.md) §10.5.
