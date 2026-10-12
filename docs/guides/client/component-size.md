# Component size

Part of the [style guide](../README.md).

## 4. Component size

**100 lines of a JSX file maximum.**

Over the limit — refactor:

1. Subcomponents → `components/`.
2. Logic → `model/` (a hook).
3. Utilities → the slice's `lib/`.
4. Static tables (tabs, modes, presets) → `<Name>.config.ts`.

**A static table whose values are JSX is the one exception to the limit.** `ui-kit/icons/TauntIcon/TauntIcon.faces.tsx` is a `Record<TauntId, ReactNode>` of sixteen faces: it cannot be a `.config.ts` (the values are JSX), and splitting one lookup table across files to satisfy a line count buys nothing. What does have to leave such a file is everything that is not the table — its drawing primitives sit in `TauntIcon.strokes.tsx`, its palette in `TauntIcon.config.ts`.

**A barrel of related primitives is no exception either.** A composite primitive that exports many small parts must not be kept as a single file: every part goes into `components/<Name>/`, and `<Name>.tsx` stays thin.

```text
ui-kit/components/PlayingCard/
  PlayingCard.tsx             ← assembly: back or face + highlight
  PlayingCard.types.ts
  PlayingCard.styles.ts
  card-theme-context.ts
  components/
    index.ts
    CardFace/CardFace.tsx     ← face: rank, suit, central mark
    CardBack/CardBack.tsx     ← back
```

Group by meaning, not "a file per export": closely related parts live together.

**A context shared by the parts is a separate module** next to `<Name>.tsx`, not inside the component: otherwise `components/*` import the parent and the parent imports them.
