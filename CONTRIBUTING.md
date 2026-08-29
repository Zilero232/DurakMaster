# Contributing

This is a closed project, so this file is for whoever has access — a teammate, or
you six months from now.

## Before you write code

Read [CLAUDE.md](CLAUDE.md). It holds five invariants that are not style
preferences: breaking any one of them breaks the game or its security.

Then, depending on what you are touching:

| Area                 | Read first                                                                               |
| -------------------- | ---------------------------------------------------------------------------------------- |
| `packages/game-core` | [docs/games/durak.md](docs/games/durak.md) — the rules, including where sources disagree |
| Client structure     | [docs/fsd.md](docs/fsd.md) — layers, slices, import direction                            |
| Anything             | [docs/style.md](docs/style.md) — naming, imports, component size                         |

## The loop

```bash
bun install
bun dev:infra                 # Postgres
bun dev:server                # one terminal
bun dev:mobile                # another
```

Before you call anything done:

```bash
bun fix       # ESLint --fix + Prettier
bun verify    # typecheck + tests + ESLint + Steiger + Prettier
```

`bun verify` is exactly what CI runs. A red build is never someone else's problem.

## Tests

Game rules carry the highest cost of being wrong, so they carry the most tests.
The checklist at the end of [docs/games/durak.md](docs/games/durak.md) lists the
mistakes that keep recurring — every entry there has a test behind it, and a new
rule should arrive with one too.

For UI changes, `bun test:e2e:shots` walks every screen at two viewports and
writes PNGs to `e2e/.shots/`. Look at them; the layouts that break are rarely the
ones you were editing.

## Commits

Conventional Commits — `feat:`, `fix:`, `refactor:`, `docs:`, `chore:`.

The subject says what changed. The body says why, when the why is not obvious
from the diff. Skip the body when it would only restate the subject.

## Comments

The project has no explanatory comments. Not `//` notes, not JSDoc describing
what code does — name things so the code reads without them.

Two exceptions: `/** ... */` on a field of an exported `type` (it shows up in
editor autocomplete), and tool directives like `eslint-disable` with the reason
they are there.

## Pull requests

- One concern per PR. A rename and a bugfix in the same diff are two PRs.
- CI must be green: `verify` and `e2e`.
- If you changed the UI, attach a screenshot.
- If you changed game rules, say which document section you are implementing.
