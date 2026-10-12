# Readability

Part of the [style guide](../README.md).

## 10.5 Destructure wherever it simplifies

The principle: **destructure as much as possible** — for readability. If a value is accessed through the dot 2+ times, or arrives nested, pull it out into a local variable.

**Nested access — destructure the parent:**

```ts
// ✗ BAD — table.settings.X repeats
if (table.settings.isPrivate) {
  /* ... */
}
const seats = table.settings.maxPlayers;
const speed = table.settings.speed;

// ✓ OK — settings is pulled out once
const { isPrivate, maxPlayers, speed } = table.settings;
```

**Function parameters — one object with destructuring** ([functions](functions.md) §9.4). Positional arguments (especially of the same type — `string, string, string`) are easy to swap by mistake; an object is self-documenting and the order does not matter.

```ts
// ✗ BAD — 4 positional, easy to mix up
resolveDisplayName(displayName, name, email, userId);

// ✓ OK — an object parameter, destructured in the signature
resolveDisplayName({ displayName, name, email, userId });
```

**When NOT to destructure:**

- A single access — `obj.x` once, destructuring is needless ceremony.
- The context is lost — if `name` without a prefix does not say whose it is, keep `player.name` / rename it (`const { name: playerName } = ...`).
- A stable namespace object (`router`, `console`, `Math`) — leave it alone.

## One condition, one name

A condition is stated once. A `hasX` flag next to a later `x === undefined` check is the same
question asked twice — collapse it into one named helper or one named constant and reuse it.

Prefer plain names and grouping over indirection: a wrapper that only forwards its arguments, or a
constant that only renames another constant, is a layer to delete.
