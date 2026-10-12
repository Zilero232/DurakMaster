# Functions

Part of the [style guide](../README.md).

## 9. Arrow functions: the body

**A function that is a single expression has an expression body; a function with statements has a
block body.** Enforced by ESLint (`arrow-body-style: as-needed`, from the preset) — `bun fix`
rewrites `=> { return x; }` into `=> x` by itself, so do not fight it by hand.

```ts
// ✓ OK — one expression
const keyExtractor = (table: LobbyTable) => table.id;

const getSelectedLift = (width: number): number =>
  -(width / cardTokens.ratio) * SELECTED_LIFT_RATIO;

// ✓ OK — statements need a block
export const formatCountdown = (remainingMs: number): string => {
  const total = Math.max(0, remainingMs);

  return formatParts(total);
};

// ✗ NOT OK — the linter rejects a block that only returns
const keyExtractor = (table: LobbyTable) => {
  return table.id;
};
```

The same holds for React components (JSX in parentheses) and inline callbacks
(`cards.map((card) => cardKey(card))`, `useSessionStore((store) => store.currentTable)`).

### 9.4 More than one argument — take an object

**A function with two or more arguments takes a single object.** Positional arguments read fine at
the definition and badly at the call: `fanOverlap(6, 80, 360, -0.45)` says nothing, and swapping
two numbers of the same type compiles. Named fields carry the meaning to the call site and let a
later argument be added without touching every caller.

```ts
// ✗ NOT OK
export const fanOverlap = (count: number, width: number, available: number, looseRatio: number) => {

// ✓ OK
export const fanOverlap = ({ count, width, available, looseRatio }: FanOverlapInput): number => {
```

The input type is named `<Name>Input` and lives in the sibling `.types.ts`
([`model/hooks` structure](../client/model-hooks.md) §2.2 for hooks, the slice's `lib/` for the
rest). One argument stays positional — `seatBackHeight(back)` needs no ceremony.

React components are already objects (props), and an inline callback keeps the signature its
caller gives it (`.map((item, index) => …)`). The server's service methods predate the rule and
still take positional arguments (`reserveStake(userId, bet)`); the rule is enforced on
`apps/mobile` and `packages/`.

### 9.5 `if` / `else` — always with braces

**The body of `if`, `else if`, `else` is always in `{}`, even for a single line.** A single-line `if (cond) doThing();` is forbidden: adding a second statement to a branch does not require rewriting the structure, diffs are cleaner, and there is no "forgot the braces" trap. Enforced by ESLint (`curly: ['error', 'all']`) — `bun lint:fix` fixes it automatically.

```ts
// ✓ OK
if (!session) {
  return;
}

if (isWinner) {
  playSound('win');
}

// ✗ NOT OK
if (!session) return;
if (isWinner) playSound('win');
```

A ternary for returning a value is still OK (it is an expression, not a statement): `return a ? b : c;`.
