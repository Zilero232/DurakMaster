# Slice `ui/` and `ui-kit`

Part of the [style guide](../README.md).

## 2. Structure of a slice's `ui/`

**The main component** lives flat in `ui/`, with its files next to it:

```text
features/lobby/create-table/ui/
  CreateTable.tsx        ← JSX + entry component
  CreateTable.types.ts   ← Props and local union types
  CreateTable.styles.ts  ← the component's StyleSheet
  CreateTable.config.ts  ← static tables/layout constants (if any)
```

**Subcomponents** (used only inside the parent) — each in a `components/` folder:

```text
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
- `.config.ts` — immutable tables that define the layout: the list of tabs, the set of game modes (`AppShell.config.ts`, `SettingsPanel.config.ts`). Data, not logic.
- `ui-kit/` — the design system (primitives/components/icons). **Not flat `button.tsx`** — every component in a PascalCase folder (§2.1). From the outside — `@/ui-kit`.

### 2.1. Structure of `ui-kit`

`ui-kit/` is a separate layer next to `shared/`: every layer imports it, and it imports nothing but itself (see [`docs/architecture/fsd.md`](../../architecture/fsd.md) §2). Every component is its own PascalCase folder.

```text
ui-kit/
  index.ts                    ← the layer's single public barrel
  primitives/                 ← basic, do not depend on other components
    index.ts                  ← re-export of all primitives
    Button/
      Button.tsx
      Button.styles.ts
      Button.types.ts         ← optional
      Button.config.ts        ← optional: hit slop per size
      feedback-context.ts     ← FeedbackProvider, usePressFeedback
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
  hooks/
    use-enter-motion/         ← useEnterMotion
  icons/
    SuitIcon/
      SuitIcon.tsx
      SuitIcon.types.ts
      index.ts
  theme/                      ← tokens, layout, card-themes, suits
```

There is no `ui-kit/lib/`. A context lives **next to the component that consumes it** (`Button/feedback-context.ts`, `PlayingCard/card-theme-context.ts`) and reaches the outside through that component's barrel. How a card is drawn — `rankLabel` in `theme/suits.ts`, `suitColor` in `theme/card-themes.ts` — is presentation, so it sits in `theme/` next to the palettes that colour it. `cardKey` is not: it is the identity of a card in game logic, re-exported from `@durak-master/game-core` by `shared/lib/cards`.

**Rules:**

- Component folder and file names are **PascalCase** (`Button/`, `Button.tsx`).
- **`primitives/` vs `components/`**: a primitive does not import other ui-kit components (except its own parts; `Button` showing a `Spinner` while loading is the one primitive-on-primitive import); anything assembled from two or more primitives, or from its own `components/`, goes into `components/`.
- **A per-component `index.ts` is mandatory** — explicit named re-exports of the component and its types, no `export *`. Aggregating barrels (`primitives/index.ts`, `ui-kit/index.ts`) re-export the segments.
- Styles are **`*.styles.ts`** with `StyleSheet.create`; values come only from `../../theme`.
- Primitives are assembled from `react-native` (`View`, `Pressable`, `Text`, `Modal`, `TextInput`). We do not use headless libraries: RN already provides accessibility through `accessibilityRole` / `accessibilityLabel` / `accessibilityState`.
- Modal panels — our own `Sheet` on top of the system `Modal` (it intercepts the hardware back button on Android and draws above native views).
- Icons — `lucide-react-native`, size and color as props: `<Settings size={18} color={colors.onFelt} />`. Suits are drawn with our own `SuitIcon` — lucide has none.
- React types are **named** (`ComponentProps`, `ReactNode`, …), not `import type * as React`.
- Inside `ui-kit` — relative imports between segments (`../../theme`, `./card-theme-context`). From the outside — only `@/ui-kit`.
- **Data from the app arrives through context, not through an import.** `ui-kit` does not read stores and does not call `@/shared/lib`: what it needs is supplied from above (§2.3).

### Slice barrel

```ts
// features/lobby/create-table/index.ts
export { CreateTable } from './ui/CreateTable';

export type { CreateTableProps } from './ui/CreateTable.types';
```

### Examples

**`Button.types.ts`:**

```ts
import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

export type ButtonVariant = 'danger' | 'ghost' | 'primary' | 'secondary';
export type ButtonSize = 'default' | 'lg' | 'sm';

export type ButtonProps = {
  children?: ReactNode;
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

Union members are sorted alphabetically — `perfectionist/sort-union-types` does it on `bun fix`.

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
    ...shadows.button
  },

  fullWidth: {
    width: '100%'
  },

  label: {
    fontFamily: fontFamily.sansBold,
    textAlign: 'center'
  }
});
```

Variants (`variant`, `size`) are style tables next to it in the same file, not branching in JSX:

```ts
type StylePair = { container: ViewStyle; label: TextStyle };

export const VARIANT_STYLES: Record<ButtonVariant, StylePair> = {
  primary: {
    container: { backgroundColor: colors.primary },
    label: { color: colors.primaryForeground }
  }
  // ...
};
```

**`Button.tsx`** (trimmed):

```tsx
import { Pressable, Text } from 'react-native';

import type { ButtonProps } from './Button.types';

import { SIZE_STYLES, styles, VARIANT_STYLES } from './Button.styles';
import { usePressFeedback } from './feedback-context';

export const Button = ({
  children,
  variant = 'secondary',
  isDisabled,
  style,
  onPress
}: ButtonProps) => {
  const feedback = usePressFeedback();

  const handlePress = () => {
    feedback();
    onPress?.();
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.root,
        VARIANT_STYLES[variant].container,
        pressed && styles.pressed,
        isDisabled && styles.disabled,
        style
      ]}
      accessibilityRole='button'
      accessibilityState={{ disabled: isDisabled }}
      disabled={isDisabled}
      onPress={handlePress}
    >
      <Text style={[styles.label, VARIANT_STYLES[variant].label]}>{children}</Text>
    </Pressable>
  );
};
```

`'use client'` is not needed anywhere — it was a Next.js directive, and Expo has no such thing.

### 2.3. `ui-kit` contexts

Two contexts built on `createContext` from `@siberiacancode/reactuse` — this is how the layer gets from the app what it is not allowed to import:

| Context                                        | Export                                                 | Who supplies the value                                                             |
| ---------------------------------------------- | ------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| `components/PlayingCard/card-theme-context.ts` | `CardThemeProvider`, `useCardTheme`, `useSetCardTheme` | `views/root-layout` (`AppProviders`) — `initialValue` from the settings store      |
| `primitives/Button/feedback-context.ts`        | `FeedbackProvider`, `usePressFeedback`                 | `views/root-layout` (`AppProviders`) — `PRESS_FEEDBACK` from `shared/lib/feedback` |

```tsx
// shared/lib/feedback/press-feedback.ts
export const PRESS_FEEDBACK = {
  onPress: () => {
    playSound('click');
    haptic('tap');
  }
};

// views/root-layout/ui/components/AppProviders/AppProviders.tsx
<FeedbackProvider initialValue={PRESS_FEEDBACK}>
  <CardThemeProvider initialValue={cardTheme}>{children}</CardThemeProvider>
</FeedbackProvider>;
```

- `Button` calls the function `usePressFeedback()` returns in its press handler — a click and vibration without depending on `expo-audio` / `expo-haptics`. The context default is a noop, so the primitive works without a provider too.
- `PlayingCard` takes the card back from `useCardTheme()` instead of reading `useSettingsStore`. Persistence stays in `entities/settings`, and the context is a projection for rendering, which is why `SettingsPanel` calls **both** the store's `setCardTheme` **and** `useSetCardTheme` when a theme is picked.

A new dependency on the app is a new context next to its consuming component, not a new import.
