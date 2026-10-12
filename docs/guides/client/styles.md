# Styles, `StyleSheet` and the theme

Part of the [style guide](../README.md).

## 3. Styles: `StyleSheet`

| Layer                      | Format                                    |
| -------------------------- | ----------------------------------------- |
| `ui-kit/**`                | `*.styles.ts` + tokens from `../../theme` |
| widgets / features / views | `*.styles.ts` + tokens from `@/ui-kit`    |

| Case                                                  | Where                                                                                 |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Styles of a component in `ui-kit`                     | `<Name>.styles.ts`                                                                    |
| Styles of a slice's subcomponent                      | `<Name>.styles.ts`                                                                    |
| Combining several styles and an optional `style` prop | array: `style={[styles.root, style]}`                                                 |
| Conditional styles                                    | `isActive && styles.active` inside the array, or a `Record<Variant, ViewStyle>` table |
| A style depends on a prop (width, theme)              | factory `createStyles(width) => StyleSheet.create({...})`                             |

The style array replaced `clsx`: RN merges the list itself, and `false` and `undefined` are ignored.

```tsx
<View style={[styles.slot, index === count - 1 && styles.lastSlot]} />
```

**Style factory.** Values that depend on a prop cannot be lifted into a module-level `StyleSheet.create` — a function is exported instead:

```ts
// AppLogo.styles.ts
export const createStyles = (size: number) =>
  StyleSheet.create({
    root: {
      alignItems: 'center',
      justifyContent: 'center',
      width: size,
      height: size
    }
  });
```

```tsx
const styles = createStyles(size);
```

The React Compiler caches the call by its arguments, so there is no recreation on every render. A
component drawn dozens of times at once — a card back — also memoises the sheet per argument set in a
module-level `Map` (`createStyles` in `ui-kit/components/PlayingCard/components/CardBack/CardBack.styles.ts`).

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
        { translateY: isSelected ? getSelectedLift(width) : 0 }
      ]
    }
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

See `widgets/lobby/table-list/ui/components/TableGrid`. `ScrollView` remains for short, knowably finite content — the body of a `Sheet`, forms.

## 12. Theme and tokens

- Tokens are TypeScript objects in `ui-kit/theme/`, exposed from `@/ui-kit`: `colors`, `spacing`, `radii`, `fontSize`, `fontFamily`, `lineHeight`, `iconSize`, `opacity`, `shadows`, `glow`, `card`, `duration`, the gradients.
- **Literal colors and spacings in components are forbidden.** `backgroundColor: '#436787'` instead of `colors.background` turns a change of appearance into a project-wide search.
- Colors are written in hex: RN does not understand `oklch()`, and the values go into native views, where interpolation has to work without parsing CSS functions.
- Fonts — the `fontFamily` keys match the names the fonts are loaded under in `views/root-layout` (`config/fonts.ts`, `useFonts` in `use-app-bootstrap`). Weight is set by **choosing the family** (`fontFamily.sansBold`), not by `fontWeight` alone: on Android, `fontWeight` without a matching font file is ignored.
- Shadows — the `shadows.*` presets, built on `boxShadow`, which the new architecture draws the same way on iOS and Android. Do not add `elevation` next to it: Android would draw both.
- Screen-dependent sizes are in `ui-kit/theme/layout.ts` (`getCardSize`, `MAX_FAN_ANGLE`, the corner and icon button sizes) and are re-exported through `ui-kit/theme/index.ts` and `ui-kit/index.ts`, never hardcoded in a view. The app is portrait phones only and RN has no breakpoints: sizes are one fluid formula — a fraction of the available width, clamped at the top and the bottom — derived from the constrained container rather than the raw window.
- There is no dark/light switch — the app is single-toned by design (`userInterfaceStyle: "dark"` in `app.json`), `colors` is one set. Only the deck's appearance switches: `CARD_THEMES` / `getCardTheme` in `ui-kit/theme/card-themes.ts`, and the selected theme is distributed through `CardThemeProvider` ([slice `ui/` and `ui-kit`](slice-ui.md) §2.3).
