# Commit messages

Part of the [style guide](../README.md).

## 22. Commit messages

[Conventional Commits](https://www.conventionalcommits.org), enforced by commitlint
in the `commit-msg` hook and re-checked on every pull request.

```text
<type>(<scope>): <subject>
```

`type` — `feat`, `fix`, `refactor`, `docs`, `chore`, `test`, `build`, `ci`, `perf`, `style`, `revert`.

`scope` is optional, and when given must be one of: `mobile`, `server`, `schemas`,
`game-core`, `ci`, `docs`, `deps`. An unknown scope fails the hook —
add it to `commitlint.config.mjs` if a new one is genuinely needed.

The subject is lowercase, without a trailing period, at most 100 characters. A leading emoji is
accepted (`bun commit` runs the `cz-git` prompt, which adds one).

```bash
feat(game-core): deal two jokers when the mode is on
fix(server): reject a joker transfer by showing a trump
chore(deps): bump expo to 57.0.2
```

The subject says what changed. The body says why, when the why is not obvious from the diff.
