---
paths:
  - 'apps/mobile/**/*.{ts,tsx}'
---

<!-- Compressed editing rules for the Expo client, loaded automatically on edit. -->
<!-- The full reasoning is docs/guides/client/react.md and segments.md; keep them in sync. -->

# Client — hooks, effects, data

- The React Compiler is on: `useMemo` / `useCallback` only for a semantically stable ref.
- Effect deps hold only what should re-trigger it; stable refs (`router`, store actions, `mutate`)
  stay out, with `// eslint-disable-next-line react/exhaustive-deps -- <reason>`.
- Zustand: one selector per value — never an object selector.
- Destructure `useQuery` on the spot and rename `data` (`data: session`); keep a `useMutation`
  result whole.
- **Server data lives in the TanStack Query cache.** Profile, friends, achievements, leaderboard
  come over `httpClient` from a slice's `api/`; a socket push writes into the cache with
  `setQueryData`. Never mirror them in a Zustand store — the store keeps connection status, the
  live table and transient UI state.
- The socket is for realtime only (`lobby:*`, `table:*`, `game:*`); a new CRUD call is an HTTP
  route, not a socket message.
