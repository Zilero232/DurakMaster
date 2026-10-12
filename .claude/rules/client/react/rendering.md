---
paths:
  - 'apps/mobile/**/*.{ts,tsx}'
---

<!-- Compressed editing rules for the Expo client, loaded automatically on edit. -->
<!-- The full reasoning is docs/guides/client/conditional-render.md and styles.md; keep them in sync. -->

# Client — rendering

- Any text — a label, a number, a separator — is inside `<Text>`. A bare string under a `View`
  crashes at runtime.
- One branch: `cond && <X />`, never `cond ? <X /> : null`, and the condition must be a boolean —
  `cards.length && …` renders `0` outside `<Text>` and crashes. Use `cards.length > 0`.
- Two branches: a ternary. Three or more: `ts-pattern` `match(...)`, `.exhaustive()` on a union.
- Long lists are `FlatList` / `FlashList`, never `ScrollView` + `.map()`.
- Images are `expo-image`. Every pressable has `accessibilityRole`, and `accessibilityLabel` when it
  holds only an icon.
- Phones only, portrait only: no `Platform.OS === 'web'`, no breakpoints, no `react-native-web`.
