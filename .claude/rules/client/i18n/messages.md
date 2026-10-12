---
paths:
  - 'apps/mobile/**/*.{ts,tsx}'
---

<!-- Compressed editing rules for the Expo client, loaded automatically on edit. -->
<!-- The full reasoning is docs/guides/client/i18n.md; keep them in sync. -->

# Client — translations

Every user-visible string goes through `t('area.key')` from `react-i18next` — one namespace, the
area is part of the key. Keys live in `shared/i18n/locales/{ru,en}/<area>.json`; add a key to both
languages in the same commit (Russian is the typed source of truth, a missing English key shows
the raw identifier). Plurals use `_one` / `_few` / `_many` / `_other` suffixes, interpolation
`{{value}}`. A key held in a config is typed `ParseKeys` (or `TranslationKey`), not `string`.
