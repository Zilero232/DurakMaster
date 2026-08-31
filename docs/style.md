# DurakMaster Style Guide

Project code style conventions for `apps/mobile/`. Architectural rules are in [`docs/fsd.md`](./fsd.md).

Tooling:

- **ESLint** (`bun lint` / `bun lint:fix`) — linter + import sorting. Config: the root `eslint.config.mjs` on top of `@siberiacancode/eslint` (`{ typescript: true, react: true, jsxA11y: true }`) plus local rule blocks (`durak/typescript`, `durak/server`, `durak/scripts`, `durak/assets` and others).
- **Prettier** (`bun format` / `bun format:check`) — formatter. Config: `prettier.config.mjs` (a re-export of `@siberiacancode/prettier` without changes), exclusions in `.prettierignore`.
- **TypeScript** strict.
- FSD boundaries and a number of React conventions are kept by hand + caught at review (the linter does not cover: hook order, `padding-line-between-statements`, FSD cross-slice imports).

In one command: `bun run verify` (typecheck + lint + format:check) and `bun run fix` (lint:fix + format).

**Why ESLint + Prettier:** the shared `@siberiacancode/*` presets are shared with the company's other projects (Chatovo, GnomeVPN) — the same rules without reconfiguring every repository. ESLint gives React-specific rules (`react/rules-of-hooks`, `react/exhaustive-deps`) and a11y checks (`siberiacancode-jsx-a11y/*`) out of the box. Stylelint is not needed — there are no CSS styles in the project, and `StyleSheet.create` is checked by types.

---

## 1. Slice structure

Every slice is a folder of segments. The minimum is `ui/` + `index.ts`:

```
widgets/game/online-table/
  index.ts          ← public API (barrel)
  ui/               ← React components
  model/            ← hooks, Zustand store, form schemas, state types
  lib/              ← pure utilities of the slice
  api/              ← I/O boundary: subscriptions, mappers, service wrappers (if any)
  config/           ← constants, config
```

---

## 2. Structure of a slice's `ui/`

**The main component** lives flat in `ui/`, with its files next to it:

```
widgets/game/online-table/ui/
  OnlineTable.tsx        ← JSX + entry component
  OnlineTable.types.ts   ← Props and local union types
  OnlineTable.styles.ts  ← the component's StyleSheet
  OnlineTable.config.ts  ← static tables/layout constants (if any)
```

**Subcomponents** (used only inside the parent) — each in a `components/` folder:

```
features/lobby/create-table/ui/
  CreateTable.tsx
  CreateTable.styles.ts
  components/
    index.ts                   ← barrel: re-exports of all subcomponents
    BetPicker/
      BetPicker.tsx
      BetPicker.types.ts
      BetPicker.styles.ts
      index.ts                 ← `export { BetPicker } from './BetPicker';`
    ModesGrid/
      ...
```

The parent imports through the barrel:

```ts
// ✓ OK
import { BetPicker, ModesGrid } from './components';

// ✗ NOT OK
import { BetPicker } from './components/BetPicker';
```

**File rules:**

- `.types.ts` — created only if there are Props or local union types.
- `.styles.ts` — the component's styles (`import { styles } from './Foo.styles'`). Mandatory on every layer that has markup.
- `.config.ts` — immutable tables that define the layout: the list of tabs, the set of game modes (`TabBar.config.ts`, `ModesGrid.config.ts`). Data, not logic.
- `ui-kit/` — the design system (primitives/components/icons). **Not flat `button.tsx`** — every component in a PascalCase folder (§2.1). From the outside — `@/ui-kit`.

### 2.1. Structure of `ui-kit`

`ui-kit/` is a separate layer next to `shared/`: every layer imports it, and it imports nothing but itself (see [`docs/fsd.md`](./fsd.md) §2). Every component is its own PascalCase folder.

```
ui-kit/
  index.ts                    ← the layer's single public barrel
  primitives/                 ← basic, do not depend on other components
    index.ts                  ← re-export of all primitives
    Button/
      Button.tsx
      Button.styles.ts
      Button.types.ts         ← optional
      index.ts                ← export { Button } from './Button';
    Avatar/
      ...
    Sheet/
      ...
  components/                 ← composite, assembled from primitives and parts
    PlayingCard/
      PlayingCard.tsx
      PlayingCard.styles.ts
      PlayingCard.types.ts
      card-theme-context.ts   ← CardThemeProvider, useCardTheme, useSetCardTheme
      components/
        index.ts
        CardFace/
        CardBack/
      index.ts
    StatusScreen/
      ...
  icons/
    SuitIcon/
      SuitIcon.tsx
      SuitIcon.types.ts
      index.ts
  theme/                      ← tokens, layout, card-themes, suits
```

There is no `ui-kit/lib/`. A context lives **next to the component that consumes it** (`Button/feedback-context.ts`, `PlayingCard/card-theme-context.ts`) and reaches the outside through that component's barrel. How a card is drawn — `isRedSuit`, `rankLabel`, `suitSymbol` — is presentation, so it sits in `theme/suits.ts` next to the palettes that colour it. `cardKey` is not: it is the identity of a card in game logic, and it lives in `shared/lib/cards`.

**Rules:**

- Component folder and file names are **PascalCase** (`Button/`, `Button.tsx`).
- **`primitives/` vs `components/`**: a primitive does not import other ui-kit components (except its own parts); anything assembled from two or more primitives, or from its own `components/`, goes into `components/`.
- **A per-component `index.ts` is mandatory** — explicit named re-exports of the component and its types, no `export *`. Aggregating barrels (`primitives/index.ts`, `ui-kit/index.ts`) re-export the segments.
- Styles are **`*.styles.ts`** with `StyleSheet.create`; values come only from `../../theme`.
- Primitives are assembled from `react-native` (`View`, `Pressable`, `Text`, `Modal`, `TextInput`). We do not use headless libraries: RN already provides accessibility through `accessibilityRole` / `accessibilityLabel` / `accessibilityState`.
- Modal panels — our own `Sheet` on top of the system `Modal` (it intercepts the hardware back button on Android and draws above native views).
- Icons — `lucide-react-native`, size and color as props: `<Settings size={18} color={colors.onFelt} />`. Suits are drawn with our own `SuitIcon` — lucide has none.
- React types are **named** (`ComponentProps`, `ReactNode`, …), not `import type * as React`.
- Inside `ui-kit` — relative imports between segments (`../../theme`, `./card-theme-context`). From the outside — only `@/ui-kit`.
- **Data from the app arrives through context, not through an import.** `ui-kit` does not read stores and does not call `@/shared/lib`: what it needs is supplied from above (§2.2).

### 2.2. `ui-kit` contexts

Two contexts built on `createContext` from `@siberiacancode/reactuse` — this is how the layer gets from the app what it is not allowed to import:

| Context | Export | Who supplies the value |
|---|---|---|
| `components/PlayingCard/card-theme-context.ts` | `CardThemeProvider`, `useCardTheme`, `useSetCardTheme` | `views/root-layout` — `initialValue` from the settings store |
| `primitives/Button/feedback-context.ts` | `FeedbackProvider`, `usePressFeedback` | `views/root-layout` — sound + vibration from `shared/lib` |

```tsx
// views/root-layout/config/press-feedback.ts
export const PRESS_FEEDBACK = {
  onPress: () => {
    unlockSound();
    playSound('click');
    haptic('tap');
  }
};

// views/root-layout/ui/components/AppProviders/AppProviders.tsx
<FeedbackProvider initialValue={PRESS_FEEDBACK}>
  <CardThemeProvider initialValue={cardTheme}>{children}</CardThemeProvider>
</FeedbackProvider>;
```

- `Button` calls `usePressFeedback()` in `onPress` — a click and vibration without depending on `expo-audio` / `expo-haptics`. The context default is a noop, so the primitive works without a provider too.
- `PlayingCard` takes the card back from `useCardTheme()` instead of reading `useSettingsStore`. Persistence stays in `entities/settings`, and the context is a projection for rendering, which is why `SettingsPanel` calls **both** the store's `setCardTheme` **and** `useSetCardTheme` when a theme is picked.

A new dependency on the app is a new context next to its consuming component, not a new import.

### Slice barrel

```ts
// widgets/game/online-table/index.ts
export { OnlineTable } from './ui/OnlineTable';
```

### Examples

**`Button.types.ts`:**

```ts
import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'default' | 'lg';

export type ButtonProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isFullWidth?: boolean;
  isDisabled?: boolean;
  /** Label for the screen reader, if the content is an icon only. */
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
};
```

**`Button.styles.ts`:**

```ts
import { StyleSheet } from 'react-native';

import { colors, fontFamily, radii, shadows, spacing } from '../../theme';

export const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: colors.transparent,
    borderRadius: radii.md,
    ...shadows.button,
  },

  fullWidth: {
    width: '100%',
  },

  label: {
    fontWeight: '700',
    fontFamily: fontFamily.sansBold,
    textAlign: 'center',
  },
});
```

Variants (`variant`, `size`) are style tables next to it in the same file, not branching in JSX:

```ts
type StylePair = { container: ViewStyle; label: TextStyle };

export const VARIANT_STYLES: Record<ButtonVariant, StylePair> = {
  primary: {
    container: { backgroundColor: colors.primary },
    label: { color: colors.primaryForeground },
  },
  // ...
};
```

**`Button.tsx`:**

```tsx
import { Pressable, Text } from 'react-native';

import { SIZE_STYLES, styles, VARIANT_STYLES } from './Button.styles';

import type { ButtonProps } from './Button.types';

export const Button = ({ children, variant = 'secondary', isDisabled, style, onPress }: ButtonProps) => (
  <Pressable
    accessibilityRole="button"
    accessibilityState={{ disabled: isDisabled }}
    disabled={isDisabled}
    style={({ pressed }) => [
      styles.root,
      VARIANT_STYLES[variant].container,
      pressed && styles.pressed,
      isDisabled && styles.disabled,
      style,
    ]}
    onPress={onPress}
  >
    <Text style={[styles.label, VARIANT_STYLES[variant].label]}>{children}</Text>
  </Pressable>
);
```

`'use client'` is not needed anywhere — it was a Next.js directive, and Expo has no such thing.

---

### 2.2. Structure of `model/hooks`

When `model/` holds several hooks with their own types, **a hook with its own types goes into its own folder**; a flat file only if there are no types.

```
features/social/friend-chat/model/hooks/
  index.ts                          ← barrel of the group
  use-friend-chat-session/
    use-friend-chat-session.ts      ← a hook without types — a folder is not required,
    index.ts                           but uniformity within the slice matters more
  use-friend-chat-unread/
    use-friend-chat-unread.ts
    use-friend-chat-unread.types.ts ← there is an Input/Output type → the folder is required
    index.ts
```

The hook's `index.ts` re-exports both the hook and the types:

```ts
export { useFriendChatUnread } from './use-friend-chat-unread';

export type * from './use-friend-chat-unread.types';
```

The hook's input type is named `Use<Name>Input` (§5). If it repeats the component's props — do not duplicate, derive it: `Pick<GameTableProps, 'tableId' | 'onLeave'>`.

Small slices do not need this: `widgets/game/online-table/model/` is two flat files (`use-latest-phrases.ts`, `use-table-sounds.ts`) without a barrel.

---

## 3. Styles: `StyleSheet`

| Layer | Format |
|---|---|
| `ui-kit/**` | `*.styles.ts` + tokens from `../../theme` |
| widgets / features / views | `*.styles.ts` |

| Case | Where |
|---|---|
| Styles of a component in `ui-kit` | `<Name>.styles.ts` |
| Styles of a slice's subcomponent | `<Name>.styles.ts` |
| Combining several styles and an optional `style` prop | array: `style={[styles.root, style]}` |
| Conditional styles | `isActive && styles.active` inside the array, or a `Record<Variant, ViewStyle>` table |
| A style depends on a prop (width, theme) | factory `createStyles(width) => StyleSheet.create({...})` |

The style array replaced `clsx`: RN merges the list itself, and `false` and `undefined` are ignored.

```tsx
<View style={[styles.slot, index === count - 1 && styles.lastSlot]} />
```

**Style factory.** Values that depend on a prop cannot be lifted into a module-level `StyleSheet.create` — a function is exported instead:

```ts
// PlayingCard.styles.ts
export const createStyles = (width: number, theme: CardTheme) => {
  return StyleSheet.create({
    root: {
      width,
      height: width / cardTokens.ratio,
      backgroundColor: theme.face,
      ...shadows.card,
    },
  });
};
```

```tsx
const styles = createStyles(width, theme);
```

The React Compiler caches the call by its arguments, so there is no recreation on every render. Examples — `ui-kit/components/PlayingCard` and its `components/CardFace`.

### 3.1. `transform` does not accumulate

**Several styles with `transform` in an array are not summed — the last one overwrites the previous ones.** This differs from CSS, where `transform` cascades, and it is a source of silent bugs: a card stops rotating because there is a style with `scale` further down the array.

All transformations of one element are collected into **one** array:

```tsx
// ✗ NOT OK — rotate will be lost, only translateY remains
<Pressable style={[{ transform: [{ rotate: '10deg' }] }, { transform: [{ translateY: -8 }] }]} />

// ✓ OK — a single transform
<Pressable
  style={[
    styles.root,
    {
      transform: [
        { rotate: `${rotation}deg` },
        { translateY: isSelected ? getSelectedLift(width) : 0 },
      ],
    },
  ]}
/>
```

See `ui-kit/components/PlayingCard/PlayingCard.tsx`.

### 3.2. Text only inside `<Text>`

RN crashes at runtime on a string that ends up as a direct child of `View`. Any label, number or separator goes into `<Text>`:

```tsx
// ✗ NOT OK — crash
<View>{profile.name}</View>

// ✓ OK
<View>
  <Text style={styles.name}>{profile.name}</Text>
</View>
```

Text styles (`fontSize`, `fontFamily`, `color`) are applied to `Text`, not to the parent `View`: there is no font inheritance the way there is in CSS.

### 3.3. Safe areas

`env(safe-area-inset-*)` is replaced by a hook:

```tsx
const insets = useSafeAreaInsets();

<View style={[styles.root, { paddingTop: insets.top }]} />;
```

The provider (`SafeAreaProvider`) is lifted into `views/root-layout` (`AppProviders`) — there is no need to wrap screens separately.

### 3.4. Lists

A scrollable list is a `FlatList`, and with hundreds of items a `FlashList` from `@shopify/flash-list`. A `ScrollView` with `.map()` renders every item at once and drops frames on the very first scroll.

```tsx
<FlashList
  data={tables}
  keyExtractor={keyExtractor}
  renderItem={({ item }) => <TableRow table={item} onJoin={onJoin} />}
  contentContainerStyle={styles.list}
/>
```

`ScrollView` remains for short, knowably finite content — the body of a `Sheet`, forms.

---

## 4. Component size

**100 lines of a JSX file maximum.**

Over the limit — refactor:

1. Subcomponents → `components/`.
2. Logic → `model/` (a hook).
3. Utilities → the slice's `lib/`.
4. Static tables (tabs, modes, presets) → `<Name>.config.ts`.

**A barrel of related primitives is no exception either.** A composite primitive that exports many small parts must not be kept as a single file: every part goes into `components/<Name>/`, and `<Name>.tsx` stays thin.

```
ui-kit/components/PlayingCard/
  PlayingCard.tsx             ← assembly: back or face + highlight
  PlayingCard.types.ts
  PlayingCard.styles.ts
  components/
    index.ts
    CardFace/CardFace.tsx     ← face: rank, suit, central mark
    CardBack/CardBack.tsx     ← back
```

Group by meaning, not "a file per export": closely related parts live together.

**A context shared by the parts is a separate module** next to `<Name>.tsx`, not inside the component: otherwise `components/*` import the parent and the parent imports them.

---

## 5. Naming

| What | How | Example |
|---|---|---|
| Slices | kebab-case | `game-table`, `create-table` |
| Segments | kebab-case | `ui`, `model`, `lib`, `api`, `config` |
| Component folder | PascalCase | `GameTable/`, `BetPicker/` |
| Component file | PascalCase + `.tsx` | `GameTable.tsx` |
| Types file | `<Name>.types.ts` | `GameTable.types.ts` |
| Styles file | `<Name>.styles.ts` | `Button.styles.ts` |
| Layout constants file | `<Name>.config.ts` | `TabBar.config.ts` |
| Hook file | kebab-case | `use-online-game.ts` |
| React component (export) | PascalCase | `GameTable` |
| Hook | `use` + camelCase | `useOnlineGame`, `useSessionStore` |
| Utility | camelCase | `sortHand`, `cardKey` |
| Props type | `<Name>Props` | `GameTableProps` |
| DTO type | `<Name>Input/Output` | `CredentialsInput` |

> FSD canon: kebab-case for all files. DurakMaster deviation: PascalCase for component folders and files, kebab-case for hooks/utilities.

---

## 6. Imports

### Aliases

`@/` → the `apps/mobile/` root, where the layers live: `@/ui-kit`, `@/entities/session`. Used for everything except relative imports within the same folder.

### Group order

Sorted by `perfectionist/sort-imports` from `@siberiacancode/eslint` (`bun lint:fix`), **with a blank line between groups**. Group order:

1. **External types** — `import type` from packages.
2. **External value imports** — `node:` builtins and packages (`react`, `react-native`, `@siberiacancode/*`, `@durak-master/*`).
3. **Types from aliases** — `import type` from `@/`.
4. **Value imports from aliases** — `@/` paths (`internalPattern`: `^@/.+`, `^~/.+`).
5. **Relative types** — `import type` from `./` `../`.
6. **Relative value imports** — `./` `../`, including `*.styles`.

Within a group — natural sorting in ascending order; named imports inside the braces are sorted by `perfectionist/sort-named-imports`.

```tsx
// 2. external values
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

// 3. types from aliases
import type { CardThemeId } from '@/ui-kit';

// 4. values from aliases
import { useSettingsStore } from '@/entities/settings';
import { CARD_THEMES, Sheet } from '@/ui-kit';

// 5. relative types
import type { SettingsPanelProps } from './SettingsPanel.types';

// 6. relative values (including styles)
import { styles } from './SettingsPanel.styles';
import { SettingsSection } from './components';
```

The configuration is `perfectionist/sort-imports` in the `@siberiacancode/eslint` preset.
The blank lines between groups are inserted by `bun lint:fix`; do not remove them by hand.

### Prohibitions

A deep import bypassing the barrel is forbidden:

```ts
// ✗ FORBIDDEN
import { TableRow } from '@/widgets/lobby/table-list/ui/components/TableRow';
import { Button } from '@/ui-kit/primitives/Button';

// ✓ OK
import { TableList } from '@/widgets/lobby/table-list';
import { Button } from '@/ui-kit';
```

`ui-kit` has a single root barrel `@/ui-kit` (the `primitives/`, `components/`, `icons/`, `lib/`, `theme/` segments are under the hood). Tokens, card utilities and deck themes come from there too: `import { colors, cardKey, CARD_THEMES } from '@/ui-kit'`. Inside `ui-kit`, relative imports are OK.

A component not re-exported from the root barrel is a gap in the barrel, not permission for a deep import: add the line to `ui-kit/index.ts` rather than a path to the folder at the call site.

ESLint does not check FSD boundaries — we catch them at review.

---

## 7. Barrel exports (`index.ts`)

**Slice:**

```ts
// features/lobby/create-table/index.ts
export { CreateTable } from './ui/CreateTable';

export type { CreateTableProps } from './ui/CreateTable.types';
```

Only what is needed from the outside. Internal subcomponents are not exported.

**Component folder:**

```ts
// ui-kit/primitives/Button/index.ts
export { Button } from './Button';

export type { ButtonProps, ButtonSize, ButtonVariant } from './Button.types';
```

**A subsystem in `model/`:** if a hook is assembled from several files in a subfolder, the `index.ts` next to them exports only the public entry point — the Provider and the hook. Internal modules and types do not go outside.

```ts
// features/lobby/create-table/model/index.ts
export { CREATE_TABLE_DEFAULTS, createTableFormSchema, toTableSettings } from './create-table-form';

export type { CreateTableFormValues } from './create-table-form';
```

Wildcard exports (`export * from`) are forbidden. Explicit named ones only.

**The only exception for `export default`** is route files in `apps/mobile/app/`: Expo Router requires a default export, otherwise the screen is not found.

---

## 8. Types

- **Everything through `type`** — Props, unions, aliases, DTOs. `interface` is forbidden:
  `ts/consistent-type-definitions: ['error', 'type']` (the `durak/typescript` block in
  `eslint.config.mjs`), `bun lint:fix` fixes it itself.
  The only exception is augmenting someone else's interface (`CustomTypeOptions`
  in `shared/i18n/i18next.d.ts`) — it can only be merged with an `interface`; the file
  is moved into the config's `ignores`.
- Props always go into `<Name>.types.ts` next to the component.
- `import type { ... }` — enforced by ESLint (`ts/consistent-type-imports`,
  `fixStyle: 'separate-type-imports'`), `bun lint:fix` fixes it itself. On `apps/server/**`
  the rule is off: Nest pulls dependencies out of decorator metadata, and
  `import type` erases them.
- `export type { ... }` — not covered by the linter, kept by hand at review.
- `unknown` instead of `any`. The rule `ts/no-explicit-any: error` is enabled in `eslint.config.mjs` — in the preset it is off.
- Discriminated unions for state variants:

```ts
export type ChatMessage =
  | { type: 'text'; body: string }
  | { type: 'file'; url: string; name: string; size: number; mime: string };
```

### 8.1 Field order in Props and destructuring

One order in all three places: **`type Props`**, **parameter destructuring**, **the component's JSX call**. That way the eye looks for the same thing in the same way.

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
  size?: 'sm' | 'md';
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
};

export const PlayerName = ({ name, isHost, seat, size = 'sm', style, onPress }: PlayerNameProps) => {
  // ...
};

// JSX:
<PlayerName name={player.name} seat={player.seat} isHost={isHost} style={styles.name} onPress={handlePress} />
```

The logic: "what we show" → "how it looks" → "what it does". Meaning first, then form, then behaviour.

Within each group the order is free, but **it must match in all three places** (Props ↔ destructuring ↔ JSX). A mismatch is caught at review.

---

## 9. Arrow functions: the body

**All declarations (top-level and module-level) use a block body with `return`.** Single-line expression bodies are forbidden: the `=> { return ... }` shape is uniform regardless of the body's size, and there is no need to rewrite it when the logic grows.

```ts
// ✓ OK
const getSelectedLift = (width: number): number => {
  return -(width / cardTokens.ratio) * SELECTED_LIFT_RATIO;
};

const keyExtractor = (table: LobbyTable) => {
  return table.id;
};

// ✗ NOT OK
const getSelectedLift = (width: number): number => -(width / cardTokens.ratio) * SELECTED_LIFT_RATIO;
```

**Exceptions — we keep the expression body:**

- **React components that return JSX directly** — JSX is a "body" in itself, and a `{ return }` wrapper visually duplicates it:

  ```tsx
  // ✓ OK
  export const FormField = ({ label, value, onChangeText }: FormFieldProps) => (
    <View style={styles.root}>
      <Text style={styles.label}>{label}</Text>

      <TextInput value={value} style={styles.input} onChangeText={onChangeText} />
    </View>
  );
  ```

- **Inline callbacks** (function arguments, JSX props, hook methods):

  ```ts
  // ✓ OK — this is an argument, not a declaration
  cards.map((card) => cardKey(card));
  tables.find((item) => item.id === tableId);
  useSessionStore((store) => store.currentTable);
  match(tab).with('profile', () => t('nav.profile'));
  ```

**Rule for review:** if the arrow is to the right of `=` (a function declaration) — block body. If the arrow is inside `(...)` or `{...}` (an argument) — your call, usually an expression.

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

---

## 10. React conventions

- Function components, arrow functions.
- Markup uses `react-native` primitives: `View` instead of `div`, `Pressable` instead of `button`, `Text` for any text. Images — `Image` from `expo-image` (caching and progressive loading out of the box), not `Image` from `react-native`.
- The React Compiler is enabled — `useMemo`/`useCallback` are not needed for micro-optimizations. We keep them only for a semantically stable ref (`useEffect` dependencies, a key in a Map).
- Event handlers are `on<Event>` in camelCase: `onPress`, `onChangeText`, `onSelectTable`.
- Types from React are **named imports**: `import type { ComponentProps, ReactNode } from 'react'`. **`import type * as React from 'react'` is forbidden.**
- Accessibility is not optional: every pressable element has an `accessibilityRole` and, if it contains only an icon, an `accessibilityLabel`. State — `accessibilityState={{ disabled, selected }}`.

### 9.1 Hook order

The linter does not sort hooks — we follow it by hand + catch it at review.

Group order:

1. **Navigation** — `useRouter`, `useLocalSearchParams`, `usePathname` (from `expo-router`).
2. **Localization / insets** — `useTranslation`, `useSafeAreaInsets`.
3. **Store / context** — `useSessionStore`, `useSettingsStore`, any `use<Name>Store`.
4. **Data** — `useSession`, TanStack Query/Mutation hooks.
5. **State** — `useState`, `useReducer`.
6. **Ref / shared values** — `useRef`, `useSharedValue`.
7. **Memo / callbacks** — `useMemo`, `useCallback`, `useAnimatedProps`, `useId`.
8. **Effects** — `useEffect`, `useLayoutEffect`.
9. **Derived const** — unpacked values from hooks.

Between groups — a blank line. Within a group — none.

```tsx
export const AppShell = () => {
  const insets = useSafeAreaInsets();

  const { data: session, isPending } = useSession();

  const status = useSessionStore((store) => store.status);
  const tables = useSessionStore((store) => store.tables);
  const connect = useSessionStore((store) => store.connect);

  const [tab, setTab] = useState<ShellTab>('profile');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    if (session) {
      void connect();
    }
  }, [session, connect]);

  return /* ... */;
};
```

**Reordering rules:**

- Do not move a hook with a data dependency: if a value is needed by the next hook — it must come before it. If the group order conflicts — leave it as is and mark it `// data dep: ... → query`.
- `if (...) useFoo()` is a `rules-of-hooks` bug — fix it, do not sort it.

**Zustand selectors** — one per value (`useSessionStore((store) => store.tables)`), not an object: an object selector returns a new reference on every render and re-renders the screen on any change to the store.

**Custom hooks** — by the semantics of their contents: `useSession` (a query) → the Data group; `useSettingsStore` (a store) → Store; `useTableSounds` (an effect) → Effects.

### 9.2 Hook / Effect dependencies

The `deps` array of `useEffect` contains only what **should actually trigger a re-run** of the effect. If we know the effect needs a single `tableId` — we do not add `table`, `router` or mutation objects "to keep the linter quiet".

**Stable refs do not go into deps.** `router` from `expo-router`, Zustand store actions, `reset`/`mutate` from react-query are stable between renders. `// eslint-disable-next-line react/exhaustive-deps` with an explicit reason is normal practice, not a hack.

```tsx
// ✗ BAD — extra deps, the mutation object changes its ref every render
useEffect(() => {
  if (!tableId) {
    router.replace('/');
  }
}, [tableId, table, router, joinMutation]);

// ✓ OK — the only trigger is tableId, the reason is recorded
// eslint-disable-next-line react/exhaustive-deps -- redirect must fire only on tableId change; router is a stable ref
useEffect(() => {
  if (!tableId) {
    router.replace('/');
  }
}, [tableId]);
```

### 9.3 Destructuring query / mutation results

The result of `useQuery` / a custom query hook is **destructured right away**; we do not carry the object around and do not reach through the dot:

```tsx
// ✗ BAD — dot access, the wrapper object is not needed
const sessionQuery = useSession();
const session = sessionQuery.data;

// ✓ OK — destructuring on the spot, renamed to something meaningful
const { data: session, isPending } = useSession();
```

`data` is almost always renamed (`data: session`) — a bare `data` carries no meaning.

**Exception — `useMutation`.** The mutation object is kept whole: both the fields (`isPending`, `isError`, `error`, `data`) and the methods (`mutateAsync`, `reset`) are needed.

### 9.4 Destructure wherever it simplifies

The principle: **destructure as much as possible** — for readability. If a value is accessed through the dot 2+ times, or arrives nested, pull it out into a local variable.

**Nested access — destructure the parent:**

```ts
// ✗ BAD — table.settings.X repeats
if (table.settings.isPrivate) { /* ... */ }
const seats = table.settings.maxPlayers;
const speed = table.settings.speed;

// ✓ OK — settings is pulled out once
const { isPrivate, maxPlayers, speed } = table.settings;
```

**Function parameters: 3+ arguments → one object with destructuring.** Positional arguments (especially of the same type — `string, string, string`) are easy to swap by mistake; an object is self-documenting and the order does not matter.

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

---

## 11. The `model/`, `lib/`, `api/` segments

**`model/`** — hooks, Zustand store, form schemas, state types.

```
entities/session/model/
  session-store.ts        ← Zustand: connection, table, profile
  use-online-game.ts      ← a hook on top of the store
```

```
features/lobby/create-table/model/
  index.ts                ← barrel
  create-table-form.ts    ← the form's zod schema, defaults, mapper into TableSettings
```

Files are kebab-case. Functions inside are camelCase.

**A subsystem → a folder.** Provider + context + hook (or a hook + 2 or more modules used only by it) → a separate folder with an `index.ts`. A fully flat `model/` (1-2 files without subfolders) is normal for small slices, as in `entities/session` and `widgets/game/online-table`.

**Grouping inside `model/`.** When a slice has many `model` files, group them into subfolders by nature (`model/contexts/`, `model/hooks/`, `model/stores/`). This is organization **inside** the `model/` segment, not a separate top-level `hooks/` segment (that one is forbidden, see below).

**The `model/` barrel rule.** Every `model/` subfolder gets its own `index.ts`. **We create a slice-level `model/index.ts` only for a flat `model/`, when several entities from one file go outside** (as in `create-table/model/index.ts`). If there are subfolders — an import from the outside goes through the subfolder's barrel:

```ts
// ✓ OK
import { useRoomControls } from '../model/hooks';
import { CREATE_TABLE_DEFAULTS } from '../model';

// ✗ NOT OK
import { useRoomControls } from '../model/hooks/use-room-controls';  // deep, bypassing the barrel
```

Between files **within the same subfolder** — a relative import by file (`./use-x`, `../types`), not through its own barrel (a self-import). `model/types.ts` is a file, not a folder: it is imported directly as `../model/types`.

**Types:**

- Local types of a single hook (`Props`, input/output, internal unions) — **right there in the same file**, do not extract them.
- Public types of the slice (used by other slices through the barrel) — in `model/types.ts` or next to the store they are re-exported from (`ConnectionStatus`, `GameOutcome` in `session-store.ts`).
- If a subsystem folder has its own internal types — `model/<subsystem>/types.ts`.

Do not create a separate `types/` or `hooks/` segment — that is a split by the file's shape rather than by the nature of the code (an FSD antipattern).

**`lib/`** — pure functions with no React dependencies:

```
widgets/game/online-table/lib/
  status.ts         ← getStatusKey — the slice's own helper

shared/lib/
  cards/            ← cardKey — a card's identity
  feedback/         ← PRESS_FEEDBACK — sound + vibration on a press
  format/           ← formatting of amounts and time
  games/durak/      ← playable.ts: getPlayableKeys / getBeatableIndexes
  haptics/          ← a wrapper over expo-haptics
  sound/            ← playback through expo-audio
  time/             ← useNow — a ticking "now"
```

**Rules of one game go to `shared/lib/games/<game>/`**, not into an entity. They are pure functions over that game's `PlayerView`, several layers read them, and a per-game folder keeps four rule sets from growing into each other.

**Card helpers are split by nature, not duplicated.** `cardKey` is identity — React keys, looking a card up in a hand — so it is `shared/lib/`, where the game layers use it. `isRedSuit` / `rankLabel` / `suitSymbol` are how a card is *drawn*; they live in `ui-kit/theme/suits.ts` and go outside from `@/ui-kit`. This is what keeps `ui-kit` free of `@/` imports (§2.1): the design system owns its rendering helpers instead of borrowing them from `shared`.

If a function returns JSX — it is a component, move it into `ui/`.

**Heuristic for `lib/` vs `model/`:** the function uses React (`useState`, `useEffect`, a store) → `model/`. Pure (takes arguments, returns a value) → `lib/`. An error class, parsers, mappers — `lib/`. A set of setting values/constants — `config/`.

**`api/` in a slice** — integration with an external service tied to the slice's domain: subscriptions, mappers, service-specific wrappers. The difference from `model/` is that `api/` is the I/O boundary (network, realtime, push service), while `model/` is hooks and state types.

Heuristic: code that **listens to / sends to** an external service → `api/`. Code that **reads/derives** domain state → `model/`. A project-agnostic client (not tied to a domain) → `shared/api/` (below).

**`api/` in `shared/`** — clients of external services:

```text
shared/api/
  auth/      ← better-auth client (authClient, useSession, getAuthToken, logout)
  socket/    ← WebSocket client on top of partysocket: queue, reconnection
  index.ts
```

Game traffic goes **over the socket, not HTTP**: the server is authoritative, the table state lives in node memory and arrives as pushes. There is no separate REST layer or axios instance in the client — a hand-rolled `fetch` for game calls is not needed and does not appear.

```ts
import { socketClient } from '@/shared/api';

import type { ClientMessage } from '@durak-master/schemas';

export const sendGameAction = (message: ClientMessage): void => {
  socketClient.send(message);
};
```

Incoming messages are validated by `serverMessageSchema` from `@durak-master/schemas` — the same contract the server builds them with.

---

## 12. Theme and tokens

- Tokens are TypeScript objects in `ui-kit/theme/`, exposed from `@/ui-kit`: `colors`, `spacing`, `radii`, `fontSize`, `fontFamily`, `shadows`, `card`, `duration`.
- **Literal colors and spacings in components are forbidden.** `backgroundColor: '#436787'` instead of `colors.background` turns a change of appearance into a project-wide search.
- Colors are written in hex: RN does not understand `oklch()`, and the values go into native views, where interpolation has to work without parsing CSS functions.
- Fonts — the `fontFamily` keys match the names the fonts are loaded under in `views/root-layout` (`config/fonts.ts`, `useFonts`). Weight is set by **choosing the family** (`fontFamily.sansBold`), not by `fontWeight` alone: on Android, `fontWeight` without a matching font file is ignored.
- Shadows — the `shadows.*` presets: they gather the incompatible iOS (`shadow*`) and Android (`elevation`) fields into a single object.
- Screen-dependent sizes are in `ui-kit/theme/layout.ts` (`getCardSize`, `cardSize`, `screen`, `MAX_FAN_ANGLE`). RN has no breakpoints, so the card size is computed as a fraction of the screen width with a clamp at the top and the bottom.
- There is no dark theme — the app is single-toned by design, `colors` is one set. Only the deck's appearance switches: `CARD_THEMES` / `getCardTheme` in `ui-kit/theme/card-themes.ts`, and the selected theme is distributed through `CardThemeProvider` (§2.2).

---

## 13. Blank lines between logical steps

The linter does not autofix `padding-line-between-statements`. We follow it by hand.

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

---

## 14. Shared schemas — `@durak-master/schemas`

Zod schemas and types shared between client and server go into `packages/schemas`:

```
packages/schemas/src/
  tables/
    inputs.ts    ← tableSettingsSchema
    outputs.ts   ← lobbyTableSchema
    types.ts     ← LobbyTable, TableSettings
    index.ts
  messages/
    ...
```

```ts
// ✓ OK
import { tableSettingsSchema, type TableSettings } from '@durak-master/schemas';

// ✗ NOT OK — duplicating the contract on the client
type TableSettings = { bet: number; maxPlayers: number };
```

`@/shared/api` exports only runtime (the socket client, better-auth), not domain types.

**FormValues vs Request types.** One zod schema gives two types — `.default()` / `.transform()` make `z.input` and `z.output` incompatible:

- `z.input<typeof schema>` — the shape of the data **before** validation, for the form's `defaultValues`.
- `z.output<typeof schema>` — the shape **after** validation (defaults applied, transforms run), for submit / sending to the server.

This is the "validation stage" axis, not "HTTP request/response". The entity type from a response is a separate one (`LobbyTable`), not the `z.output` of an input schema.

A form schema may **extend** the domain schema with a field that is absent from the snapshot (the table password: the server accepts it separately and never puts it into the table state) — see `features/lobby/create-table/model/create-table-form.ts`.

---

## 15. Forms — react-hook-form + zodResolver

`register` does not work in React Native: `TextInput` has no DOM `change` event, which is what RHF hooks into under the hood. **Every field is wrapped in a `Controller`.**

```tsx
import { credentialsSchema } from '@durak-master/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';

import type { CredentialsInput } from '@durak-master/schemas';

const DEFAULT_VALUES: CredentialsInput = { email: '', password: '', name: '' };

const {
  control,
  formState: { errors, isSubmitting },
  handleSubmit,
  setError,
} = useForm<CredentialsInput>({
  resolver: zodResolver(credentialsSchema),
  defaultValues: DEFAULT_VALUES,
});
```

```tsx
<Controller
  control={control}
  name="email"
  render={({ field }) => (
    <FormField
      label={t('auth.email')}
      value={field.value}
      isInvalid={Boolean(errors.email)}
      keyboardType="email-address"
      autoCapitalize="none"
      onChangeText={field.onChange}
      onBlur={field.onBlur}
    />
  )}
/>
```

- The schema goes into `@durak-master/schemas`, not inline in the form. A form-specific schema goes into the slice's `model/`.
- `control` is passed into the fields subcomponent typed (`Control<CredentialsInput>`), not as `any`.
- Server-side errors — `setError('root', { message })`; better-auth messages arrive in English, we show our own translation.
- A form that reaches the bottom of the screen is wrapped in `KeyboardAvoidingView` with `behavior={Platform.OS === 'ios' ? 'padding' : 'height'}`, and scrolling uses a `ScrollView` with `keyboardShouldPersistTaps="handled"`, otherwise the first tap only dismisses the keyboard.
- Examples: `features/auth/sign-in`, `features/lobby/create-table`.

---

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

```tsx
// ✗ NOT OK — a needless : null
{footer ? <View style={styles.footer}>{footer}</View> : null}

// ✓ OK
{footer && <View style={styles.footer}>{footer}</View>}
```

The inverse `cond ? null : <X />` → `!cond && <X />`.

**The condition must be a `boolean`.** `&&` renders the left operand as is — for a
non-boolean falsy value (`0`, `''`, `NaN`) RN will try to draw it as text outside `<Text>`
and **crash at runtime** (on the web this would just be a stray "0" in the markup).
Numeric/string checks are converted to boolean first:

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

---

## 17. Animations — Reanimated

`react-native-reanimated` v4. Animations run on the UI thread, so they do not stall along with JS.

**Appearance/disappearance/reordering** — declarative presets on `Animated.View`:

```tsx
import Animated, { FadeOut, LinearTransition, SlideInRight } from 'react-native-reanimated';

<Animated.View
  key={key}
  entering={SlideInRight.springify().damping(30).stiffness(380)}
  exiting={FadeOut.duration(160)}
  layout={LinearTransition.springify().damping(30).stiffness(380)}
/>;
```

`layout` is mandatory wherever elements swap places (the player's hand): without it the neighbours jump abruptly.

**A continuous value** — `useSharedValue` + `withTiming` / `withSpring`, read in `useAnimatedStyle` / `useAnimatedProps`:

```tsx
const progress = useSharedValue(value);

useEffect(() => {
  progress.value = withTiming(value, { duration: duration.panel });
}, [value, progress]);

const animatedProps = useAnimatedProps(() => {
  return { text: `${Math.round(progress.value)}` };
});
```

Durations come from `duration` in `@/ui-kit`, not as literals.

The `key` of animated list elements must be stable and domain-based (`cardKey(card)`), not an index: with an index Reanimated assumes the card stayed the same and the reordering animation does not play.

---

## 18. Translations — i18next

`react-i18next`, one namespace (`translation`), the key is passed whole:

```tsx
const { t } = useTranslation();

<Text>{t('table.take')}</Text>;
```

- **No `useTranslations('namespace')`** — there is one namespace in the project, the prefix is part of the key.
- **Keys are typed** from `ru.json` through the `CustomTypeOptions` augmentation (`shared/i18n/i18next.d.ts`): a typo in a key is a compile error rather than a raw identifier on screen. The Russian file is the source of truth; the English one may lag behind.
- **Interpolation — double braces**: `t('result.rating', { value: ratingDelta })` for `"rating": "Рейтинг +{{value}}"`.
- **Pluralization — key suffixes**, not ICU syntax. The forms are computed by `Intl.PluralRules`:

  ```jsonc
  // ru.json — three forms
  { "cards": { "count_one": "{{count}} карта", "count_few": "{{count}} карты", "count_many": "{{count}} карт" } }

  // en.json — two
  { "cards": { "count_one": "{{count}} card", "count_other": "{{count}} cards" } }
  ```

  ```tsx
  <Text>{t('cards.count', { count: hand.length })}</Text>
  ```

- Locales are in `apps/mobile/shared/i18n/locales/{ru,en}.json`. A key added only to `ru.json` will pass the types, but in English the screen will show the identifier — edit both files in one commit.
- The language is restored asynchronously in `views/root-layout` (`model/use-app-bootstrap.ts`, `restoreLocale`): the app starts in the default language, and the first frame does not wait on disk. To change it — `changeLocale(locale)`; the choice survives a restart.
- A key assembled in a config is typed with `ParseKeys` from `i18next` (`TabBar.config.ts`), not `string`.

---

## 19. Server

This guide covers `apps/mobile/`. The project invariants (server authority, cryptographic randomness, `PlayerView`) are in [`CLAUDE.md`](../CLAUDE.md). The game rules are in [`docs/games/`](./games/), and their implementation is `packages/game-core`.

---

## 20. Prohibitions

- `console.log` in a commit. ESLint `no-console: warn` (`console.warn` / `console.error` are allowed; in `**/scripts/**` the rule is off — there the console is CLI output).
- `any` — use `unknown`. The rule `ts/no-explicit-any: error` is enabled in `eslint.config.mjs`.
- A non-null assertion `!` without justification — `ts/no-non-null-assertion: warn`.
- Deep imports bypassing the barrel.
- Cross-imports between slices of the same layer.
- Biome, Stylelint, CSS-in-JS. Only ESLint + Prettier + `StyleSheet`.
- Literal colors, spacings and durations in components. Only tokens from `@/ui-kit`.
- A bare string outside `<Text>` — a runtime crash.
- Several styles with `transform` in one array — fold them into one.
- `register` from react-hook-form. In RN it is `Controller` only.
- Duplicating schemas between client/server. Only `@durak-master/schemas`.
- `useState` for form fields. Only `react-hook-form`.
- An object Zustand selector (`useStore((s) => ({ a: s.a, b: s.b }))`) — a new reference on every render.
- `ScrollView` + `.map()` for long lists. Use `FlatList` / `FlashList`.
- Nested `if (...) return <X />` for 3+ branches. Use `ts-pattern match`.
- Anything other than route files in `apps/mobile/app/` (see [`docs/fsd.md`](./fsd.md) §1).
- `'use client'` — a Next.js directive, it means nothing in Expo.
- **Explanatory comments in code.** No `//` notes and no JSDoc blocks describing what
  the code does or why. Name things so the code reads without them: pull a condition
  into a named constant, a block into a named function. The exceptions are the two
  places where a comment is part of an API rather than a note about the code: a
  `/** ... */` on a field of an exported `type` (it shows up in editor autocomplete,
  see section 8), and a directive a tool reads (`eslint-disable`, `@ts-expect-error`)
  — which still needs its reason on the same line.

---

## 21. Checklist before a commit

```bash
bun fix          # lint:fix + format — ESLint autofixes and Prettier formatting
bun lint         # must be 0 errors/warnings
bun format:check # formatting unchanged
bun typecheck    # types across all workspaces
bun verify       # typecheck + lint + format:check in one command
```

`bun fix` does not fix: blank lines (section 13), hook order (section 9.1), FSD import boundaries (→ [`docs/fsd.md`](./fsd.md)), translation completeness (section 18), explanatory comments (section 20).

## 22. Commit messages

[Conventional Commits](https://www.conventionalcommits.org), enforced by commitlint
in the `commit-msg` hook and re-checked on every pull request.

```
<type>(<scope>): <subject>
```

`type` — `feat`, `fix`, `refactor`, `docs`, `chore`, `test`, `build`, `ci`, `perf`, `style`, `revert`.

`scope` is optional, and when given must be one of: `mobile`, `server`, `schemas`,
`game-core`, `platform`, `ci`, `docs`, `deps`. An unknown scope fails the hook —
add it to `commitlint.config.mjs` if a new one is genuinely needed.

The subject is lowercase, without a trailing period, at most 100 characters.

```bash
feat(game-core): deal two jokers when the mode is on
fix(server): reject a joker transfer by showing a trump
chore(deps): bump expo to 57.0.2
```
