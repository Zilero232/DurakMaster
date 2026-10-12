# DurakMaster Style Guide

Project code-style conventions for `apps/mobile/`, `apps/server/` and the shared packages.
Architectural rules live in [`docs/architecture/fsd.md`](../architecture/fsd.md); the design
decisions behind the product are in [`docs/architecture/`](../README.md#architecture). The
compressed editing versions of these guides are the digests in
[`.claude/rules/`](../../.claude/rules/), loaded automatically by path.

Tools:

- **ESLint** (`bun lint` / `bun lint:fix`) — linter + import, union and JSX-prop sorting (`perfectionist/*`). Config: the root `eslint.config.mjs` on top of `@siberiacancode/eslint` (`{ typescript: true, react: true, jsxA11y: true }`) plus local rule blocks (`durak/typescript`, `durak/server`, `durak/scripts`, `durak/assets` and others). `docs/**` is not linted.
- **Prettier** (`bun format` / `bun format:check`) — formatter. Config: `prettier.config.mjs` (a re-export of `@siberiacancode/prettier` without changes), exclusions in `.prettierignore`.
- **Steiger** (`bun lint:fsd`) — FSD layer and slice boundaries in `apps/mobile`. Config: `steiger.config.ts`.
- **TypeScript** strict — the root on `@siberiacancode/tsconfig`, `apps/mobile` on `expo/tsconfig.base`; pinned to 6.0.3 (root [`CLAUDE.md`](../../CLAUDE.md)).
- Hook order, blank lines and `ui-kit` purity are kept by hand and caught at review — no linter covers them.

In one command: `bun run verify` (typecheck + tests + lint + Steiger + format:check) and `bun run fix` (lint:fix + format).

**Why ESLint + Prettier:** the shared `@siberiacancode/*` presets are shared with the company's other projects (Chatovo, GnomeVPN) — the same rules without reconfiguring every repository. ESLint gives React-specific rules (`react/rules-of-hooks`, `react/exhaustive-deps`) and a11y checks (`siberiacancode-jsx-a11y/*`) out of the box. Stylelint is not needed — there are no CSS styles in the project, and `StyleSheet.create` is checked by types.

## Sections

### Client (`apps/mobile`)

- [Slice structure](client/slices.md) — §1
- [Slice `ui/` and `ui-kit`](client/slice-ui.md) — §2, §2.1, §2.3 `ui-kit` contexts
- [`model/hooks` structure](client/model-hooks.md) — §2.2
- [Styles, `StyleSheet` and the theme](client/styles.md) — §3, §3.1–3.4, §12
- [Component size](client/component-size.md) — §4
- [Component body order](client/component-body.md) — §8.2
- [React conventions](client/react.md) — §10, §10.1–10.4, server data in the Query cache
- [The `model/`, `lib/` and `api/` segments](client/segments.md) — §11
- [Forms](client/forms.md) — §15
- [Conditional render](client/conditional-render.md) — §16, §15.1
- [Animations — Reanimated](client/animations.md) — §17
- [Translations — i18next](client/i18n.md) — §18

### Server (`apps/server`)

- [Server modules — NestJS](server/nestjs.md) — §19, module convention, input and errors, realtime, environment
- [Data — Prisma and money writes](server/data.md) — schema and migrations, conditional balance updates

### Shared (TypeScript everywhere)

- [Naming](shared/naming.md) — §5
- [Imports and barrels](shared/imports-and-barrels.md) — §6, §7
- [Types](shared/types.md) — §8, §8.1
- [Functions](shared/functions.md) — §9, §9.4, §9.5
- [Blank lines](shared/blank-lines.md) — §13
- [Readability](shared/readability.md) — §10.5, one condition one name
- [Comments](shared/comments.md)
- [Shared schemas](shared/schemas.md) — §14
- [Tests](shared/testing.md)
- [Forbidden](shared/forbidden.md) — §20
- [Checklist before a commit](shared/checklist.md) — §21, verification, the toolchain
- [Commit messages](shared/commits.md) — §22

The section numbers are the ones `docs/style.md` used before the split, kept so old references
still resolve. Its two §2.2 sections are now §2.2 (`model/hooks`) and §2.3 (`ui-kit` contexts);
§19 was a placeholder and is now the server guide.
