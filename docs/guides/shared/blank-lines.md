# Blank lines

Part of the [style guide](../README.md).

## 13. Blank lines between logical steps

The linter does not autofix `padding-line-between-statements` — the preset turns it off. We follow
it by hand.

**A blank line before:**

- `return` (if it is not the first statement)
- `throw`
- `if` (an early-return guard or branching)
- an `await` followed by a logically separate step
- `try` / `for` / `while` / `switch`

**After an `if` block** — a blank line before the next statement.

```ts
const trimmed = name.trim();

if (!trimmed) {
  throw new Error('Table name required');
}

const stored = await AsyncStorage.getItem(LOCALE_STORAGE_KEY);
const locale = stored ? resolveLocale(stored) : detectLocale();

if (locale !== i18next.language) {
  await i18next.changeLanguage(locale);
}

return locale;
```

```tsx
// ✓ multiple returns
if (isPending) {
  return <View style={styles.root} />;
}

if (!session) {
  return <SignInForm />;
}

return <AppShell />;
```

**Exceptions** (no blank line needed):

- A single statement in the block.
- Consecutive `const`s of one semantic block (store selectors, unpacking props).

In JSX, sibling elements that are separate blocks get a blank line between them too
(`<StatusBar />`, `<Stack />`, `<SessionNotices />` in `RootLayout`).
