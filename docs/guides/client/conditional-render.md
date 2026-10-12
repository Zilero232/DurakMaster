# Conditional render

Part of the [style guide](../README.md).

## 16. Conditional render — ts-pattern

3+ render branches → `match`, not nested `if (...) return <X />` and not chains of ternaries in JSX.

What to match on — two options, both OK:

**A. On a single discriminant value:**

```tsx
import { match } from 'ts-pattern';

const title = match(tab)
  .with('profile', () => t('nav.profile'))
  .with('tables', () => t('lobby.title'))
  .with('create', () => t('create.title'))
  .exhaustive();
```

`.exhaustive()` gives a TS error if a union variant was added but the case was forgotten.

**B. On an object of flags.** `match` directly on `{ ...fields }`, with patterns via `P.nullish` / `P.string` and so on. We take this when there are few branches and a separate hook layer would be needless ceremony:

```tsx
import { match } from 'ts-pattern';

const tone = match({ isWinner, isDraw })
  .with({ isWinner: true }, (): ResultTone => 'win')
  .with({ isDraw: true }, (): ResultTone => 'draw')
  .otherwise((): ResultTone => 'lose');
```

The order of `.with` matters — the first matching pattern wins. Take narrowed values in the handlers
from the `match` argument (it is narrowed), not from the closure and not through `as` — a cast bypasses
type checking.

**Forbidden in any case** — `if`/ternary chains that assemble JSX:

```tsx
// ✗ NOT OK — condition hell in the view
return !tableId ? null : isLoading ? <Loading /> : !table ? <NotFound /> : <Table />;
```

**When to extract into a hook:** the state assembly is reused in 2+ places, or the body of the logic
is so large that the view stops being readable. Otherwise option B inline in the view is normal.

### 15.1 A single branch — `&&`, not `? : null`

A "present/absent" render (one branch, otherwise nothing) — `cond && <X />`, not `cond ? <X /> : null`:

<!-- prettier-ignore -->
```tsx
// ✗ NOT OK — a needless : null
{footer ? <View style={styles.footer}>{footer}</View> : null}

// ✓ OK
{footer && <View style={styles.footer}>{footer}</View>}
```

The inverse `cond ? null : <X />` → `!cond && <X />`.

**The condition must be a `boolean`.** `&&` renders the left operand as is — for a
non-boolean falsy value (`0`, `''`, `NaN`) RN will try to draw it as text outside `<Text>`
and **crash at runtime**. Numeric/string checks are converted to boolean first:

<!-- prettier-ignore -->
```tsx
// ✗ DANGEROUS — a crash on an empty hand
{cards.length && <PlayerHand cards={cards} />}

// ✓ OK — an explicit boolean check
{cards.length > 0 && <PlayerHand cards={cards} />}
{!isEmpty(cards) && <PlayerHand cards={cards} />}   // isEmpty from remeda
```

Safe as a condition: boolean flags (`isActive`), comparisons (`x === y`),
`!x`, `!!x`, an object/`undefined` (`errors.email`), `isEmpty()`/`isNonNullish()`.

The ternary remains for **two** genuine branches (`cond ? <A /> : <B />`).
