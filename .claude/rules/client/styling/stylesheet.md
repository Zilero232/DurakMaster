---
paths:
  - 'apps/mobile/**/*.{ts,tsx}'
---

<!-- Compressed editing rules for the Expo client, loaded automatically on edit. -->
<!-- The full reasoning is docs/guides/client/styles.md; keep them in sync. -->

# Client — styles and tokens

- Styles live in `Name.styles.ts` with `StyleSheet.create`; a prop-dependent sheet is a
  `createStyles(...)` factory. Combine with arrays: `[styles.root, isActive && styles.active, style]`.
- No literal colors, spacings, sizes or durations — tokens from `@/ui-kit` (`../../theme` inside
  `ui-kit`). New layout constants go to `ui-kit/theme/layout.ts` and are re-exported through
  `theme/index.ts` and `ui-kit/index.ts`.
- Sizing is fluid — one formula from the constrained container, clamped — never breakpoints.
- All transforms of one element go into **one** `transform` array; a later style's `transform`
  replaces an earlier one.
- Font weight is the family (`fontFamily.sansBold`), not `fontWeight` alone. Shadows are the
  `shadows.*` presets — never add `elevation` next to them.
- Safe areas through `useSafeAreaInsets()`; the provider is already in `AppProviders`.
