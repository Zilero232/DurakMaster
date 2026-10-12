---
paths:
  - 'apps/mobile/**/*.{ts,tsx}'
---

<!-- Compressed editing rules for the Expo client, loaded automatically on edit. -->
<!-- The full reasoning is docs/guides/client/ (slices, slice-ui, model-hooks, segments); keep them in sync. -->

# Client — slice layout

Segments: `ui/`, `model/`, `lib/` (pure), `api/` (HTTP calls + query hooks), `config/`. Never a
`hooks/`, `types/` or `components/` segment.

- The main component lives flat in `ui/` with `Name.tsx`, `Name.styles.ts` (mandatory),
  `Name.types.ts` (when there are props), `Name.config.ts` (static tables). Subcomponents go to
  `ui/components/<Name>/` with an `index.ts` each and a `components/index.ts` barrel.
- Hooks live in `model/hooks/<use-name>/` with `use-name.ts`, optional `.types.ts` / `.config.ts`,
  and an `index.ts`; the group has `model/hooks/index.ts`. A hook's input type is `Use<Name>Input`.
- Every `model/` subfolder has a barrel; inside a subfolder import siblings by file.
- `ui-kit` components are PascalCase folders under `primitives/` (no other ui-kit component) or
  `components/` (composite); tokens and rendering helpers in `theme/`; no `lib/`.
- A JSX file stays under 100 lines — split into `components/`, a hook, `lib/` or `.config.ts`. The
  one exception is a lookup table whose values are JSX (`TauntIcon.faces.tsx`).
