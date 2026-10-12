# Comments

Part of the [style guide](../README.md).

## No explanatory comments

No `//` notes and no JSDoc blocks describing what the code does or why. Name things so the code
reads without them: pull a condition into a named constant, a block into a named function. The
reasoning belongs in `docs/` or the commit message.

The exceptions are the two places where a comment is part of an API rather than a note about the
code:

- a `/** ... */` on a field of an exported `type` — it shows up in editor autocomplete
  ([types](types.md) §8);
- a directive a tool reads (`eslint-disable-next-line`, `@ts-expect-error`) — which still needs its
  reason on the same line: `// eslint-disable-next-line react/exhaustive-deps -- <reason>`.

Config files are not application code: `eslint.config.mjs`, `steiger.config.ts`, `mise.toml`,
`bunfig.toml`, the Dockerfile, the compose files and the workflows in `.github/` carry comments
that explain a non-obvious setting, and keep them.
