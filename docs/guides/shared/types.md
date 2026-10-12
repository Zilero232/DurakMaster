# Types

Part of the [style guide](../README.md).

## 8. Types

- **Everything through `type`** — Props, unions, aliases, DTOs. `interface` is forbidden:
  `ts/consistent-type-definitions: ['error', 'type']` (the `durak/typescript` block in
  `eslint.config.mjs`), `bun lint:fix` fixes it itself. Even the i18next augmentation in
  `apps/mobile/i18next.d.ts` declares `CustomTypeOptions` as a `type`.
- Props always go into `<Name>.types.ts` next to the component.
- `import type { ... }` — enforced by ESLint (`ts/consistent-type-imports`,
  `fixStyle: 'separate-type-imports'`), `bun lint:fix` fixes it itself. On `apps/server/**`
  the rule is off: Nest pulls dependencies out of decorator metadata, and
  `import type` erases them.
- `export type { ... }` — not covered by the linter, kept by hand at review.
- `unknown` instead of `any`. The rule `ts/no-explicit-any: error` is enabled in `eslint.config.mjs` — in the preset it is off.
- Union members are sorted alphabetically — `perfectionist/sort-union-types` rewrites them on `bun fix` (`'confirming' | 'idle' | 'showing'`).
- Discriminated unions for state variants:

```ts
export type AdSkipOutcome =
  | { status: 'duplicate' }
  | { status: 'granted'; profile: MyProfile }
  | { status: 'nothing-to-skip' };
```

- A shared domain type is never redeclared locally — it comes from `@durak-master/schemas` ([shared schemas](schemas.md) §14).

### 8.1 Field order in Props and destructuring

One order in **`type Props`** and **parameter destructuring**. That way the eye looks for the same thing in the same way.

The order:

1. **Data** — string, number, boolean, objects, refs, `children`.
2. **Identifiers / styles** — `accessibilityLabel`, `style`.
3. **Event handlers** — `onPress`, `onChangeText`, `onClose`, any `on<Event>`.

```ts
// ✓ OK
export type PlayerNameProps = {
  name: string;
  isHost?: boolean;
  seat?: number;
  size?: 'md' | 'sm';
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
};

export const PlayerName = ({
  name,
  isHost,
  seat,
  size = 'sm',
  style,
  onPress
}: PlayerNameProps) => {
  // ...
};
```

The logic: "what we show" → "how it looks" → "what it does". Meaning first, then form, then behaviour.

Within each group the order is free, but **it must match between Props and destructuring**. A mismatch is caught at review.

**The JSX call is sorted by the linter, not by hand.** `perfectionist/sort-jsx-props` orders the
attributes on `bun fix`: shorthand props, then `key`/`ref`, then multiline props, then the rest
alphabetically, and every `on<Event>` callback last:

```tsx
<PlayerName
  isHost
  name={player.name}
  seat={player.seat}
  style={styles.name}
  onPress={handlePress}
/>
```

The handlers-last part of the Props order is what survives into JSX.
