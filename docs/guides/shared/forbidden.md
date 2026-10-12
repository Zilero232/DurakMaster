# Forbidden

Part of the [style guide](../README.md).

## 20. Prohibitions

- `console.log` in a commit. ESLint `no-console: warn` (`console.warn` / `console.error` are allowed; in `**/scripts/**` the rule is off — there the console is CLI output). The server logs through Nest's `Logger` (pino underneath).
- `any` — use `unknown`. The rule `ts/no-explicit-any: error` is enabled in `eslint.config.mjs`.
- A non-null assertion `!` without justification — `ts/no-non-null-assertion: warn`.
- Deep imports bypassing the barrel.
- Cross-imports between slices of the same layer.
- Biome, Stylelint, CSS-in-JS. Only ESLint + Prettier + `StyleSheet`.
- Literal colors, spacings and durations in components. Only tokens from `@/ui-kit`.
- A bare string outside `<Text>` — a runtime crash.
- Several styles with `transform` in one array — fold them into one.
- `register` from react-hook-form. In RN it is `Controller` only.
- Duplicating schemas between client/server. Only `@durak-master/schemas`.
- `useState` for form fields. Only `react-hook-form`.
- An object Zustand selector (`useStore((s) => ({ a: s.a, b: s.b }))`) — a new reference on every render.
- Mirroring server data (profile, friends, …) in a Zustand store — the TanStack Query cache is the state.
- `ScrollView` + `.map()` for long lists. Use `FlatList` / `FlashList`.
- Nested `if (...) return <X />` for 3+ branches. Use `ts-pattern match`.
- Anything other than route files in `apps/mobile/app/` (see [`docs/architecture/fsd.md`](../../architecture/fsd.md) §1).
- `Platform.OS === 'web'` branches, breakpoints, `react-native-web` — the app is phones only.
- `'use client'` — a Next.js directive, it means nothing in Expo.
- `Math.random()` anywhere near game logic — `crypto.randomInt()` on the server only.
- **Explanatory comments in code** — see [comments](comments.md).
