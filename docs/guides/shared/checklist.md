# Checklist before a commit

Part of the [style guide](../README.md).

## 21. Checklist before a commit

```bash
bun fix          # lint:fix + format — ESLint autofixes and Prettier formatting
bun verify       # typecheck + tests + ESLint + Steiger + Prettier, in one command
```

`bun verify` runs, in order: `bun run typecheck` (every workspace), `bun run test` (Vitest),
`bun run lint` (must be 0 errors/warnings), `bun run lint:fsd` (Steiger over `apps/mobile`) and
`bun run format:check`. It is exactly what CI runs (`.github/workflows/verify.yml`), and the
release workflow runs it again before building. A red build is never someone else's problem.

`bun fix` does not fix: blank lines ([blank lines](blank-lines.md) §13), logic left in a component
([React](../client/react.md) §10.1), hook order ([React](../client/react.md) §10.2), `ui-kit`
purity (→ [`docs/architecture/fsd.md`](../../architecture/fsd.md) §2), translation completeness
([i18n](../client/i18n.md) §18), explanatory comments ([comments](comments.md)).

The pre-commit hook runs `lint-staged` (ESLint `--fix` + Prettier on staged files) and typechecks
only the workspaces the commit touches; the commit-msg hook runs commitlint
([commits](commits.md) §22).

## Verify before claiming anything works

Neither `bun verify` nor the tests catch:

- **A better-auth bump.** Sign-up has no test; sign up against a running API by hand
  (root [`CLAUDE.md`](../../../CLAUDE.md), pinned dependencies).
- **Native-only breakage.** A module missing from the dev build, a Hermes-only crash, an Expo
  config plugin — run the app on a device ([local dev](../../ops/local-dev.md)).
- **UI on other screen sizes.** Check every screen you touched on a small phone and a large one.

## The toolchain

`mise.toml` pins bun and node (22, for the Expo and EAS CLIs). CI installs the same versions
through `jdx/mise-action` in `.github/actions/setup`. The only other bun pin is the `oven/bun` tag
in `apps/server/Dockerfile`, so bumping bun means both.
