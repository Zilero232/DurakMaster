---
paths:
  - 'apps/mobile/**/*.{ts,tsx}'
---

<!-- Compressed editing rules for the Expo client, loaded automatically on edit. -->
<!-- The full reasoning is docs/guides/client/animations.md; keep them in sync. -->

# Client — animation

Reanimated 4, on the UI thread. Mount/unmount/reorder with `entering` / `exiting` / `layout` on
`Animated.View`; `layout` is mandatory where items swap places (the hand). Continuous values are
`useSharedValue` + `withTiming` / `withSpring`. Durations come from `duration` in `@/ui-kit`. Keys
of animated items are domain keys (`cardKey(card)`), never indexes.
