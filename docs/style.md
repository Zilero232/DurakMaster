# DurakMaster Style Guide

Проектные кодстайл-конвенции для `apps/mobile/`. Архитектурные правила — в [`docs/fsd.md`](./fsd.md).

Инструменты:

- **ESLint** (`bun lint` / `bun lint:fix`) — линтер + сортировка импортов. Конфиг: корневой `eslint.config.mjs` поверх `@siberiacancode/eslint` (`{ typescript: true, react: true, jsxA11y: true }`) плюс локальные блоки правил (`durak/typescript`, `durak/server`, `durak/scripts`, `durak/assets` и др.).
- **Prettier** (`bun format` / `bun format:check`) — форматтер. Конфиг: `prettier.config.mjs` (реэкспорт `@siberiacancode/prettier` без изменений), исключения — `.prettierignore`.
- **TypeScript** strict.
- FSD-границы и ряд React-конвенций держим руками + ловим на review (линтер не покрывает: порядок хуков, `padding-line-between-statements`, FSD cross-slice imports).

Одной командой: `bun run verify` (typecheck + lint + format:check) и `bun run fix` (lint:fix + format).

**Почему ESLint + Prettier:** общие пресеты `@siberiacancode/*` разделяются с другими проектами компании (Chatovo, GnomeVPN) — одинаковые правила без перенастройки на каждом репозитории. ESLint даёт React-специфичные правила (`react/rules-of-hooks`, `react/exhaustive-deps`) и a11y-проверки (`siberiacancode-jsx-a11y/*`) из коробки. Stylelint не нужен — стилей в CSS в проекте нет, а `StyleSheet.create` проверяется типами.

---

## 1. Структура слайса

Каждый слайс — папка с сегментами. Минимум — `ui/` + `index.ts`:

```
widgets/game/game-table/
  index.ts          ← public API (barrel)
  ui/               ← React-компоненты
  model/            ← хуки, Zustand store, схемы форм, типы стейта
  lib/              ← чистые утилиты слайса
  api/              ← I/O-граница: подписки, мапперы, сервис-обёртки (если есть)
  config/           ← константы, конфиг
```

---

## 2. Структура `ui/` слайса

**Главный компонент** живёт плоско в `ui/`, файлы рядом:

```
widgets/game/game-table/ui/
  GameTable.tsx          ← JSX + entry-компонент
  GameTable.types.ts     ← Props и локальные union-типы
  GameTable.styles.ts    ← StyleSheet компонента
  GameTable.config.ts    ← статичные таблицы/константы разметки (если есть)
```

**Подкомпоненты** (используются только внутри родителя) — каждый в папке `components/`:

```
features/lobby/create-table/ui/
  CreateTable.tsx
  CreateTable.styles.ts
  components/
    index.ts                   ← barrel: re-exports всех подкомпонентов
    BetPicker/
      BetPicker.tsx
      BetPicker.types.ts
      BetPicker.styles.ts
      index.ts                 ← `export { BetPicker } from './BetPicker';`
    ModesGrid/
      ...
```

Родитель импортирует через barrel:

```ts
// ✓ ОК
import { BetPicker, ModesGrid } from './components';

// ✗ НЕ ОК
import { BetPicker } from './components/BetPicker';
```

**Правила файлов:**

- `.types.ts` — создаётся только если есть Props или локальные union-типы.
- `.styles.ts` — стили компонента (`import { styles } from './Foo.styles'`). Обязательно на всех слоях, где есть разметка.
- `.config.ts` — неизменяемые таблицы, задающие разметку: список вкладок, набор режимов игры (`TabBar.config.ts`, `ModesGrid.config.ts`). Данные, а не логика.
- `ui-kit/` — дизайн-система (primitives/components/icons). **Не плоские `button.tsx`** — каждый компонент в PascalCase-папке (§2.1). Снаружи — `@/ui-kit`.

### 2.1. Структура `ui-kit`

`ui-kit/` — отдельный слой рядом с `shared/`: его импортируют все слои, сам он не импортирует ничего, кроме себя (см. [`docs/fsd.md`](./fsd.md) §2). Каждый компонент — отдельная папка в PascalCase.

```
ui-kit/
  index.ts                    ← единый публичный barrel слоя
  primitives/                 ← базовые, не зависят от других компонентов
    index.ts                  ← re-export всех primitives
    Button/
      Button.tsx
      Button.styles.ts
      Button.types.ts         ← опционально
      index.ts                ← export { Button } from './Button';
    Avatar/
      ...
    Sheet/
      ...
  components/                 ← составные, собраны из primitives и частей
    PlayingCard/
      PlayingCard.tsx
      PlayingCard.styles.ts
      PlayingCard.types.ts
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
  lib/                        ← утилиты и контексты слоя
    cards/                    ← cardKey, rankLabel, suitSymbol, isRedSuit
    feedback-context.ts       ← FeedbackProvider, usePressFeedback
  theme/                      ← tokens, layout, card-themes, card-theme-context
```

**Правила:**

- Имена папок и файлов компонентов — **PascalCase** (`Button/`, `Button.tsx`).
- **`primitives/` vs `components/`**: примитив не импортирует другие компоненты ui-kit (кроме своих частей); собранный из двух и более примитивов или из собственного `components/` — в `components/`.
- **Per-component `index.ts` обязателен** — явные именованные реэкспорты компонента и его типов, без `export *`. Агрегирующие barrel (`primitives/index.ts`, `ui-kit/index.ts`) реэкспортят сегменты.
- Стили — **`*.styles.ts`** с `StyleSheet.create`; значения только из `../../theme`.
- Примитивы собираются из `react-native` (`View`, `Pressable`, `Text`, `Modal`, `TextInput`). Headless-библиотеки не используем: RN уже даёт доступность через `accessibilityRole` / `accessibilityLabel` / `accessibilityState`.
- Модальные панели — собственный `Sheet` поверх системного `Modal` (он перехватывает аппаратную кнопку «назад» на Android и рисуется поверх нативных вьюх).
- Иконки — `lucide-react-native`, размер и цвет пропсами: `<Settings size={18} color={colors.onFelt} />`. Масти рисуем своим `SuitIcon` — в lucide их нет.
- Типы React — **именованные** (`ComponentProps`, `ReactNode`, …), не `import type * as React`.
- Внутри `ui-kit` — относительные импорты между сегментами (`../../theme`, `../../lib`). Снаружи — только `@/ui-kit`.
- **Данные от приложения — через контекст, не импортом.** `ui-kit` не читает сторы и не зовёт `@/shared/lib`: нужное подставляется сверху (§2.2).

### 2.2. Контексты `ui-kit`

Два контекста на `createContext` из `@siberiacancode/reactuse` — так слой получает от приложения то, что не вправе импортировать:

| Контекст | Экспорт | Значение подставляет |
|---|---|---|
| `theme/card-theme-context.ts` | `CardThemeProvider`, `useCardTheme`, `useSetCardTheme` | `app/_layout.tsx` — `initialValue` из стора настроек |
| `lib/feedback-context.ts` | `FeedbackProvider`, `usePressFeedback` | `app/_layout.tsx` — звук + вибрация из `shared/lib` |

```tsx
// app/_layout.tsx
const handlePressFeedback = () => {
  unlockSound();
  playSound('click');
  haptic('tap');
};

<FeedbackProvider initialValue={handlePressFeedback}>
  <CardThemeProvider initialValue={cardTheme}>{/* … */}</CardThemeProvider>
</FeedbackProvider>;
```

- `Button` зовёт `usePressFeedback()` в `onPress` — щелчок и вибрация без зависимости от `expo-audio` / `expo-haptics`. Дефолт контекста — noop, поэтому примитив работает и без провайдера.
- `PlayingCard` берёт рубашку из `useCardTheme()`, не читая `useSettingsStore`. Персист остаётся в `entities/settings`, контекст — проекция для отрисовки, поэтому `SettingsPanel` при выборе темы вызывает **и** `setCardTheme` стора, **и** `useSetCardTheme`.

Новая зависимость от приложения — новый контекст в `ui-kit/lib/` (или `ui-kit/theme/`, если это оформление), а не новый импорт.

### Slice barrel

```ts
// widgets/game/game-table/index.ts
export { GameTable } from './ui/GameTable';

export type { GameTableProps } from './ui/GameTable.types';
```

### Примеры

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
  /** Подпись для читалки экрана, если содержимое — только значок. */
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

Варианты (`variant`, `size`) — таблицы стилей рядом в том же файле, не разветвление в JSX:

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

`'use client'` не нужен нигде — это была директива Next.js, в Expo её нет.

---

### 2.2. Структура `model/hooks`

Когда в `model/` несколько хуков со своими типами, **хук со своими типами — в собственной папке**, плоский файл только если типов нет.

```
features/social/friend-chat/model/hooks/
  index.ts                          ← barrel группы
  use-friend-chat-session/
    use-friend-chat-session.ts      ← хук без типов — папка не обязательна,
    index.ts                           но единообразие внутри слайса важнее
  use-friend-chat-unread/
    use-friend-chat-unread.ts
    use-friend-chat-unread.types.ts ← есть Input/Output-тип → папка обязательна
    index.ts
```

`index.ts` хука реэкспортит и хук, и типы:

```ts
export { useFriendChatUnread } from './use-friend-chat-unread';

export type * from './use-friend-chat-unread.types';
```

Тип входа хука называется `Use<Name>Input` (§5). Если он повторяет пропсы компонента — не дублируй, а выведи: `Pick<GameTableProps, 'tableId' | 'onLeave'>`.

Мелким слайсам это не нужно: `widgets/game/online-table/model/` — два плоских файла (`use-latest-phrases.ts`, `use-table-sounds.ts`) без barrel.

---

## 3. Стили: `StyleSheet`

| Слой | Формат |
|---|---|
| `ui-kit/**` | `*.styles.ts` + токены из `../../theme` |
| widgets / features / views | `*.styles.ts` |

| Случай | Куда |
|---|---|
| Стили компонента в `ui-kit` | `<Name>.styles.ts` |
| Стили подкомпонента слайса | `<Name>.styles.ts` |
| Склейка нескольких стилей и опционального `style` prop | массив: `style={[styles.root, style]}` |
| Условные стили | `isActive && styles.active` внутри массива, либо таблица `Record<Variant, ViewStyle>` |
| Стиль зависит от пропа (ширина, тема) | фабрика `createStyles(width) => StyleSheet.create({...})` |

Массив стилей заменил `clsx`: RN сам склеивает список, `false` и `undefined` игнорируются.

```tsx
<View style={[styles.slot, index === count - 1 && styles.lastSlot]} />
```

**Фабрика стилей.** Значения, зависящие от пропа, нельзя вынести в модульный `StyleSheet.create` — экспортируется функция:

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

React Compiler кеширует вызов по аргументам, так что пересоздания на каждый рендер нет. Примеры — `ui-kit/components/PlayingCard` и его `components/CardFace`.

### 3.1. `transform` не складывается

**Несколько стилей с `transform` в массиве не суммируются — последний перетирает предыдущие.** Это отличие от CSS, где `transform` каскадится, и источник тихих багов: карта перестаёт поворачиваться, потому что ниже по массиву есть стиль со `scale`.

Все трансформации одного элемента собираются в **один** массив:

```tsx
// ✗ НЕ ОК — rotate потеряется, останется только translateY
<Pressable style={[{ transform: [{ rotate: '10deg' }] }, { transform: [{ translateY: -8 }] }]} />

// ✓ ОК — один transform
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

Cм. `ui-kit/components/PlayingCard/PlayingCard.tsx`.

### 3.2. Текст только внутри `<Text>`

RN падает в рантайме на строке, оказавшейся прямым потомком `View`. Любая подпись, число, разделитель — в `<Text>`:

```tsx
// ✗ НЕ ОК — крэш
<View>{profile.name}</View>

// ✓ ОК
<View>
  <Text style={styles.name}>{profile.name}</Text>
</View>
```

Стили текста (`fontSize`, `fontFamily`, `color`) применяются к `Text`, не к родительскому `View`: наследования шрифтов, как в CSS, нет.

### 3.3. Безопасные зоны

`env(safe-area-inset-*)` заменён хуком:

```tsx
const insets = useSafeAreaInsets();

<View style={[styles.root, { paddingTop: insets.top }]} />;
```

Провайдер (`SafeAreaProvider`) поднят в `app/_layout.tsx` — отдельно оборачивать экраны не нужно.

### 3.4. Списки

Прокручиваемый список — `FlatList`, а при сотнях элементов `FlashList` из `@shopify/flash-list`. `ScrollView` с `.map()` рендерит все элементы сразу и роняет кадры на первом же скролле.

```tsx
<FlashList
  data={tables}
  keyExtractor={keyExtractor}
  renderItem={({ item }) => <TableRow table={item} onJoin={onJoin} />}
  contentContainerStyle={styles.list}
/>
```

`ScrollView` остаётся для короткого заведомо конечного содержимого — тела `Sheet`, формы.

---

## 4. Размер компонента

**100 строк JSX-файла максимум.**

Перевалил — рефактор:

1. Подкомпоненты → `components/`.
2. Логика → `model/` (хук).
3. Утилиты → `lib/` слайса.
4. Статичные таблицы (вкладки, режимы, пресеты) → `<Name>.config.ts`.

**Barrel родственных примитивов — тоже не исключение.** Составной примитив, экспортирующий много мелких частей, держать одним файлом нельзя: каждая часть — в `components/<Name>/`, а `<Name>.tsx` остаётся тонким.

```
ui-kit/components/PlayingCard/
  PlayingCard.tsx             ← сборка: рубашка или лицо + подсветка
  PlayingCard.types.ts
  PlayingCard.styles.ts
  components/
    index.ts
    CardFace/CardFace.tsx     ← лицо: ранг, масть, центральный знак
    CardBack/CardBack.tsx     ← рубашка
```

Группируй по смыслу, а не «файл на экспорт»: близкие части живут вместе.

**Контекст, который шарят части, — отдельным модулем** рядом с `<Name>.tsx`, не внутри компонента: иначе `components/*` импортируют родителя, а родитель — их.

---

## 5. Naming

| Что | Как | Пример |
|---|---|---|
| Слайсы | kebab-case | `game-table`, `create-table` |
| Сегменты | kebab-case | `ui`, `model`, `lib`, `api`, `config` |
| Папка компонента | PascalCase | `GameTable/`, `BetPicker/` |
| Файл компонента | PascalCase + `.tsx` | `GameTable.tsx` |
| Файл типов | `<Name>.types.ts` | `GameTable.types.ts` |
| Файл стилей | `<Name>.styles.ts` | `Button.styles.ts` |
| Файл констант разметки | `<Name>.config.ts` | `TabBar.config.ts` |
| Файл хука | kebab-case | `use-online-game.ts` |
| React-компонент (export) | PascalCase | `GameTable` |
| Хук | `use` + camelCase | `useOnlineGame`, `useSessionStore` |
| Утилита | camelCase | `sortHand`, `cardKey` |
| Тип Props | `<Name>Props` | `GameTableProps` |
| DTO тип | `<Name>Input/Output` | `CredentialsInput` |

> Канон FSD: kebab-case для всех файлов. DurakMaster отклонение: PascalCase для папок и файлов компонентов, kebab-case для хуков/утилит.

---

## 6. Импорты

### Алиасы

`@/` → корень `apps/mobile/`, где лежат слои: `@/ui-kit`, `@/entities/session`. Используем для всего кроме относительных в той же папке.

### Порядок групп

Сортирует `perfectionist/sort-imports` из `@siberiacancode/eslint` (`bun lint:fix`), **с пустой строкой между группами**. Порядок групп:

1. **Внешние типы** — `import type` из пакетов.
2. **Внешние value-импорты** — `node:`-builtins и пакеты (`react`, `react-native`, `@siberiacancode/*`, `@durak-master/*`).
3. **Типы из алиасов** — `import type` из `@/`.
4. **Value-импорты из алиасов** — `@/`-пути (`internalPattern`: `^@/.+`, `^~/.+`).
5. **Относительные типы** — `import type` из `./` `../`.
6. **Относительные value-импорты** — `./` `../`, сюда же попадают `*.styles`.

Внутри группы — natural-сортировка по возрастанию; именованные импорты внутри скобок сортирует `perfectionist/sort-named-imports`.

```tsx
// 2. внешние value
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

// 3. типы из алиасов
import type { CardThemeId } from '@/ui-kit';

// 4. value из алиасов
import { useSettingsStore } from '@/entities/settings';
import { CARD_THEMES, Sheet } from '@/ui-kit';

// 5. относительные типы
import type { SettingsPanelProps } from './SettingsPanel.types';

// 6. относительные value (включая стили)
import { styles } from './SettingsPanel.styles';
import { SettingsSection } from './components';
```

Конфигурация — `perfectionist/sort-imports` в пресете `@siberiacancode/eslint`.
Пустые строки между группами расставляет `bun lint:fix`; не удаляй их вручную.

### Запреты

Deep import мимо barrel запрещён:

```ts
// ✗ ЗАПРЕЩЕНО
import { TableRow } from '@/widgets/lobby/table-list/ui/components/TableRow';
import { Button } from '@/ui-kit/primitives/Button';

// ✓ ОК
import { TableList } from '@/widgets/lobby/table-list';
import { Button } from '@/ui-kit';
```

`ui-kit` — единый корневой barrel `@/ui-kit` (сегменты `primitives/`, `components/`, `icons/`, `lib/`, `theme/` под капотом). Токены, утилиты карты и темы колоды приходят оттуда же: `import { colors, cardKey, CARD_THEMES } from '@/ui-kit'`. Внутри `ui-kit` — относительные ОК.

Компонент не реэкспортится из корневого barrel — это пробел в barrel, а не разрешение на deep import: добавь строку в `ui-kit/index.ts`, а не путь до папки в место использования.

ESLint не проверяет FSD-границы — ловим на review.

---

## 7. Barrel-экспорты (`index.ts`)

**Слайс:**

```ts
// features/lobby/create-table/index.ts
export { CreateTable } from './ui/CreateTable';

export type { CreateTableProps } from './ui/CreateTable.types';
```

Только то, что нужно снаружи. Внутренние подкомпоненты — не экспортируем.

**Папка компонента:**

```ts
// ui-kit/primitives/Button/index.ts
export { Button } from './Button';

export type { ButtonProps, ButtonSize, ButtonVariant } from './Button.types';
```

**Подсистема в `model/`:** если хук собран из нескольких файлов в подпапке, `index.ts` рядом с ними экспортирует только публичную точку входа — Provider и хук. Внутренние модули и типы наружу не идут.

```ts
// features/lobby/create-table/model/index.ts
export { CREATE_TABLE_DEFAULTS, createTableFormSchema, toTableSettings } from './create-table-form';

export type { CreateTableFormValues } from './create-table-form';
```

Wildcard-экспорты (`export * from`) — запрещены. Только явные именованные.

**Единственное исключение для `export default`** — роут-файлы в `apps/mobile/app/`: Expo Router требует default-экспорт, иначе экран не найдётся.

---

## 8. Типы

- **Всё через `type`** — Props, unions, алиасы, DTO. `interface` запрещён:
  `ts/consistent-type-definitions: ['error', 'type']` (блок `durak/typescript` в
  `eslint.config.mjs`), `bun lint:fix` чинит сам.
  Единственное исключение — аугментация чужого интерфейса (`CustomTypeOptions`
  в `shared/i18n/i18next.d.ts`), слить с ним можно только `interface`; файл
  вынесен в `ignores` конфига.
- Props всегда в `<Name>.types.ts` рядом с компонентом.
- `import type { ... }` — ESLint enforce (`ts/consistent-type-imports`,
  `fixStyle: 'separate-type-imports'`), `bun lint:fix` чинит сам. На `apps/server/**`
  правило выключено: Nest достаёт зависимости из метаданных декораторов, а
  `import type` их стирает.
- `export type { ... }` — линтером не покрыт, держим руками на review.
- `unknown` вместо `any`. Правило `ts/no-explicit-any: error` включено в `eslint.config.mjs` — в пресете оно выключено.
  запрет держим руками на review.
- Discriminated unions для вариантов состояния:

```ts
export type ChatMessage =
  | { type: 'text'; body: string }
  | { type: 'file'; url: string; name: string; size: number; mime: string };
```

### 8.1 Порядок полей в Props и деструктуризации

Один порядок во всех трёх местах: **`type Props`**, **деструктуризация параметров**, **JSX-вызов компонента**. Так глаз ищет одно и то же одинаково.

Порядок:

1. **Данные** — string, number, boolean, объекты, refs, `children`.
2. **Идентификаторы / стили** — `accessibilityLabel`, `style`.
3. **Обработчики событий** — `onPress`, `onChangeText`, `onClose`, любые `on<Event>`.

```ts
// ✓ ОК
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

Логика: «что показываем» → «как выглядит» → «что делает». Сначала смысл, потом форма, потом поведение.

Внутри каждой группы порядок свободный, но **в трёх местах должен совпадать** (Props ↔ destructuring ↔ JSX). Расхождение ловится на ревью.

---

## 9. Arrow-функции: тело

**Все объявления (top-level и модульные) — block body с `return`.** Однострочные expression body запрещены: вид `=> { return ... }` единообразен независимо от размера тела, не приходится переписывать когда логика растёт.

```ts
// ✓ ОК
const getSelectedLift = (width: number): number => {
  return -(width / cardTokens.ratio) * SELECTED_LIFT_RATIO;
};

const keyExtractor = (table: LobbyTable) => {
  return table.id;
};

// ✗ НЕ ОК
const getSelectedLift = (width: number): number => -(width / cardTokens.ratio) * SELECTED_LIFT_RATIO;
```

**Исключения — оставляем expression body:**

- **React-компоненты, возвращающие JSX напрямую** — JSX сам по себе является «телом», обёртка `{ return }` визуально дублирует:

  ```tsx
  // ✓ ОК
  export const FormField = ({ label, value, onChangeText }: FormFieldProps) => (
    <View style={styles.root}>
      <Text style={styles.label}>{label}</Text>

      <TextInput value={value} style={styles.input} onChangeText={onChangeText} />
    </View>
  );
  ```

- **Inline-колбэки** (аргументы функций, JSX-пропсы, методы хуков):

  ```ts
  // ✓ ОК — это аргумент, не объявление
  cards.map((card) => cardKey(card));
  tables.find((item) => item.id === tableId);
  useSessionStore((store) => store.currentTable);
  match(tab).with('profile', () => t('nav.profile'));
  ```

**Правило для review:** если стрелка справа от `=` (объявление функции) — block body. Если стрелка внутри `(...)` или `{...}` (аргумент) — на усмотрение, обычно expression.

### 9.5 `if` / `else` — всегда с фигурными скобками

**Тело `if`, `else if`, `else` всегда в `{}`, даже на одну строку.** Однострочный `if (cond) doThing();` запрещён: добавление второго стейтмента в ветку не требует переписывать структуру, диффы чище, нет ловушки «забыл скобки». Enforced биомом (`style/useBlockStatements`, `error`) — `bun lint:fix` чинит автоматически.

```ts
// ✓ ОК
if (!session) {
  return;
}

if (isWinner) {
  playSound('win');
}

// ✗ НЕ ОК
if (!session) return;
if (isWinner) playSound('win');
```

Тернарник для возврата значения — по-прежнему ОК (это выражение, не стейтмент): `return a ? b : c;`.

---

## 10. React-конвенции

- Функциональные компоненты, arrow-функции.
- Разметка — примитивы `react-native`: `View` вместо `div`, `Pressable` вместо `button`, `Text` для любого текста. Картинки — `Image` из `expo-image` (кеш и прогрессивная загрузка из коробки), не `Image` из `react-native`.
- React Compiler включён — не нужны `useMemo`/`useCallback` для микро-оптимизаций. Оставляем только для семантического stable ref (зависимости `useEffect`, key в Map).
- Обработчики событий — `on<Event>` camelCase: `onPress`, `onChangeText`, `onSelectTable`.
- Типы из React — **именованные импорты**: `import type { ComponentProps, ReactNode } from 'react'`. **`import type * as React from 'react'` запрещён.**
- Доступность — не опциональна: у каждого нажимаемого элемента `accessibilityRole` и, если внутри только значок, `accessibilityLabel`. Состояние — `accessibilityState={{ disabled, selected }}`.

### 9.1 Порядок хуков

Линтер не сортирует хуки — соблюдаем руками + ловим на review.

Порядок групп:

1. **Navigation** — `useRouter`, `useLocalSearchParams`, `usePathname` (из `expo-router`).
2. **Localization / insets** — `useTranslation`, `useSafeAreaInsets`.
3. **Store / context** — `useSessionStore`, `useSettingsStore`, любые `use<Name>Store`.
4. **Data** — `useSession`, TanStack Query/Mutation хуки.
5. **State** — `useState`, `useReducer`.
6. **Ref / shared values** — `useRef`, `useSharedValue`.
7. **Memo / callbacks** — `useMemo`, `useCallback`, `useAnimatedProps`, `useId`.
8. **Effects** — `useEffect`, `useLayoutEffect`.
9. **Derived const** — распакованные значения хуков.

Между группами — пустая строка. Внутри группы — без пустой.

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

**Правила перестановки:**

- Не переставляй хук с data dependency: если значение нужно следующему хуку — оно обязано быть до него. Если порядок групп противоречит — оставь как есть, пометь `// data dep: ... → query`.
- `if (...) useFoo()` — это баг `rules-of-hooks`, чинить, не сортировать.

**Zustand-селекторы** — по одному на значение (`useSessionStore((store) => store.tables)`), не объектом: объектный селектор возвращает новую ссылку каждый рендер и перерисовывает экран на любое изменение стора.

**Кастомные хуки** — по семантике содержимого: `useSession` (запрос) → группа Data; `useSettingsStore` (стор) → Store; `useTableSounds` (эффект) → Effects.

### 9.2 Зависимости хуков / Effects

`deps`-массив `useEffect` — только то, что **реально должно триггерить перезапуск** эффекта. Знаем что эффекту нужен один `tableId` — не добавляем `table`, `router`, объекты мутаций «чтобы линтер молчал».

**Стабильные ref не идут в deps.** `router` из `expo-router`, экшены Zustand-стора, `reset`/`mutate` из react-query стабильны между рендерами. `// eslint-disable-next-line react/exhaustive-deps` с явной причиной — нормальная практика, не костыль.

```tsx
// ✗ ПЛОХО — лишние deps, объект мутации меняет ref каждый рендер
useEffect(() => {
  if (!tableId) {
    router.replace('/');
  }
}, [tableId, table, router, joinMutation]);

// ✓ ОК — триггер только tableId, причина зафиксирована
// eslint-disable-next-line react/exhaustive-deps -- redirect must fire only on tableId change; router is a stable ref
useEffect(() => {
  if (!tableId) {
    router.replace('/');
  }
}, [tableId]);
```

### 9.3 Деструктуризация результатов query / mutation

Результат `useQuery` / кастомного query-хука **деструктурируем сразу**, не носим объект и не лазаем через точку:

```tsx
// ✗ ПЛОХО — доступ через точку, объект-обёртка не нужен
const sessionQuery = useSession();
const session = sessionQuery.data;

// ✓ ОК — деструктуризация на месте, переименование под смысл
const { data: session, isPending } = useSession();
```

`data` почти всегда переименовываем (`data: session`) — голое `data` не несёт смысла.

**Исключение — `useMutation`.** Объект мутации оставляем цельным: нужны и поля (`isPending`, `isError`, `error`, `data`), и методы (`mutateAsync`, `reset`).

### 9.4 Деструктуризация везде, где упрощает

Принцип: **деструктурируй по максимуму** — для читаемости. Если значение используется через точку 2+ раза или приходит вложенным, вытащи его в локальную переменную.

**Вложенный доступ — деструктурируй родителя:**

```ts
// ✗ ПЛОХО — table.settings.X повторяется
if (table.settings.isPrivate) { /* ... */ }
const seats = table.settings.maxPlayers;
const speed = table.settings.speed;

// ✓ ОК — settings вытащен один раз
const { isPrivate, maxPlayers, speed } = table.settings;
```

**Параметры-функции: 3+ аргумента → один объект с деструктуризацией.** Позиционные аргументы (особенно одного типа — `string, string, string`) легко перепутать местами; объект самодокументирует и порядок не важен.

```ts
// ✗ ПЛОХО — 4 позиционных, легко перепутать
resolveDisplayName(displayName, name, email, userId);

// ✓ ОК — объект-параметр, деструктуризация в сигнатуре
resolveDisplayName({ displayName, name, email, userId });
```

**Когда НЕ деструктурировать:**

- Одно обращение — `obj.x` один раз, деструктуризация лишняя церемония.
- Теряется контекст — если `name` без префикса непонятно чьё, оставь `player.name` / переименуй (`const { name: playerName } = ...`).
- Стабильный неймспейс-объект (`router`, `console`, `Math`) — не трогаем.

---

## 11. Сегменты `model/`, `lib/`, `api/`

**`model/`** — хуки, Zustand store, схемы форм, типы стейта.

```
entities/session/model/
  session-store.ts        ← Zustand: соединение, стол, профиль
  use-online-game.ts      ← хук поверх стора
```

```
features/lobby/create-table/model/
  index.ts                ← barrel
  create-table-form.ts    ← zod-схема формы, дефолты, маппер в TableSettings
```

Файлы — kebab-case. Функции внутри — camelCase.

**Подсистема → папка.** Provider + context + хук (либо хук + 2+ модуля только для него) → отдельная папка с `index.ts`. Совсем плоский `model/` (1-2 файла без подпапок) — норма для мелких слайсов, как в `entities/session` и `widgets/game/online-table`.

**Группировка внутри `model/`.** Когда в слайсе много `model`-файлов, группируй их в подпапки по природе (`model/contexts/`, `model/hooks/`, `model/stores/`). Это организация **внутри** сегмента `model/`, не отдельный top-level сегмент `hooks/` (тот запрещён, см. ниже).

**Barrel-правило `model/`.** У каждой подпапки `model/` — свой `index.ts`. **Slice-level `model/index.ts` создаём только у плоского `model/`, когда наружу идёт несколько сущностей из одного файла** (как `create-table/model/index.ts`). Если подпапки есть — импорт снаружи через barrel подпапки:

```ts
// ✓ ОК
import { useRoomControls } from '../model/hooks';
import { CREATE_TABLE_DEFAULTS } from '../model';

// ✗ НЕ ОК
import { useRoomControls } from '../model/hooks/use-room-controls';  // deep мимо barrel
```

Между файлами **внутри одной подпапки** — относительный импорт по файлу (`./use-x`, `../types`), не через свой barrel (самоимпорт). `model/types.ts` — это файл, не папка: импортируется напрямую `../model/types`.

**Типы:**

- Локальные типы одного хука (`Props`, ввод/вывод, internal unions) — **рядом в том же файле**, не выносить.
- Публичные типы слайса (используются другими слайсами через barrel) — в `model/types.ts` или рядом со стором, откуда реэкспортятся (`ConnectionStatus`, `GameOutcome` в `session-store.ts`).
- Если у подсистемы-папки свои внутренние типы — `model/<subsystem>/types.ts`.

Не создавай отдельный сегмент `types/` или `hooks/` — это разделение по форме файла, а не по природе кода (антипаттерн FSD).

**`lib/`** — чистые функции без React-зависимостей:

```
entities/game/lib/
  playable.ts       ← getPlayableKeys / getBeatableIndexes

shared/lib/
  format/           ← форматирование сумм и времени
  haptics/          ← обёртка над expo-haptics
  sound/            ← воспроизведение через expo-audio
  time/             ← useNow — тикающее «сейчас»

ui-kit/lib/
  cards/            ← cardKey, rankLabel, suitSymbol, isRedSuit
```

Утилиты карты живут в `ui-kit/lib/`, а не в `shared/lib/`: их потребитель — `PlayingCard` и `SuitIcon`, а `ui-kit` не вправе импортить `@/shared` (§2.1). Наружу они идут из `@/ui-kit`.

Если функция возвращает JSX — это компонент, переместить в `ui/`.

**Эвристика `lib/` vs `model/`:** функция использует React (`useState`, `useEffect`, стор) → `model/`. Чистая (получает аргументы, возвращает значение) → `lib/`. Класс ошибки, парсеры, мапперы — `lib/`. Набор значений-настроек/констант — `config/`.

**`api/` в слайсе** — интеграция с внешним сервисом, привязанная к домену слайса: подписки, мапперы, сервис-специфичные обёртки. Отличие от `model/` — `api/` это I/O-граница (сеть, realtime, push-сервис), `model/` — хуки и типы стейта.

Эвристика: код **слушает/шлёт** во внешний сервис → `api/`. Код **читает/выводит** доменный стейт → `model/`. Project-agnostic клиент (не привязан к домену) → `shared/api/` (ниже).

**`api/` в `shared/`** — клиенты внешних сервисов:

```text
shared/api/
  auth/      ← better-auth клиент (authClient, useSession, getAuthToken, logout)
  socket/    ← WebSocket-клиент поверх partysocket: очередь, переподключение
  index.ts
```

Игровой обмен идёт **через сокет, а не HTTP**: сервер авторитетен, состояние стола живёт в памяти ноды и приходит пушами. Отдельного REST-слоя и axios-инстанса в клиенте нет — самодельный `fetch` для игровых вызовов не нужен и не появляется.

```ts
import { socketClient } from '@/shared/api';

import type { ClientMessage } from '@durak-master/schemas';

export const sendGameAction = (message: ClientMessage): void => {
  socketClient.send(message);
};
```

Входящие сообщения валидируются `serverMessageSchema` из `@durak-master/schemas` — тем же контрактом, которым сервер их формирует.

---

## 12. Тема и токены

- Токены — TypeScript-объекты в `ui-kit/theme/`, наружу — из `@/ui-kit`: `colors`, `spacing`, `radii`, `fontSize`, `fontFamily`, `shadows`, `card`, `duration`.
- **Литеральные цвета и отступы в компонентах запрещены.** `backgroundColor: '#436787'` вместо `colors.background` превращает смену оформления в поиск по проекту.
- Цвета записаны в hex: RN не понимает `oklch()`, а значения уходят в нативные вьюхи, где интерполяция должна работать без парсинга CSS-функций.
- Шрифты — ключи `fontFamily` совпадают с именами, под которыми шрифты грузятся в `app/_layout.tsx` через `useFonts`. Начертание задаётся **выбором семейства** (`fontFamily.sansBold`), а не только `fontWeight`: на Android `fontWeight` без соответствующего файла шрифта игнорируется.
- Тени — пресеты `shadows.*`: они собирают несовместимые поля iOS (`shadow*`) и Android (`elevation`) в один объект.
- Размеры, зависящие от экрана, — в `ui-kit/theme/layout.ts` (`getCardSize`, `cardSize`, `screen`, `MAX_FAN_ANGLE`). Точек останова в RN нет, поэтому размер карты считается долей ширины экрана с зажимом сверху и снизу.
- Тёмной темы нет — приложение одноцветное по замыслу, `colors` один набор. Переключается только оформление колоды: `CARD_THEMES` / `getCardTheme` в `ui-kit/theme/card-themes.ts`, выбранная тема раздаётся через `CardThemeProvider` (§2.2).

---

## 13. Пустые строки между логическими шагами

Линтер не автофиксит `padding-line-between-statements`. Соблюдаем руками.

**Пустая строка перед:**

- `return` (если не первый statement)
- `throw`
- `if` (early-return guard или branching)
- `await` после которого идёт логически отдельный шаг
- `try` / `for` / `while` / `switch`

**После `if`-блока** — пустая строка перед следующим statement.

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
// ✓ множественные return
if (isPending) {
  return <View style={styles.root} />;
}

if (!session) {
  return <SignInForm />;
}

return <AppShell />;
```

**Исключения** (пустая НЕ нужна):

- Один statement в блоке.
- Последовательные `const` одного смыслового блока (селекторы стора, распаковка пропсов).

---

## 14. Shared схемы — `@durak-master/schemas`

Zod схемы и типы, общие для client/server, — в `packages/schemas`:

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
// ✓ ОК
import { tableSettingsSchema, type TableSettings } from '@durak-master/schemas';

// ✗ НЕ ОК — дублирование контракта на клиенте
type TableSettings = { bet: number; maxPlayers: number };
```

`@/shared/api` экспортирует только runtime (сокет-клиент, better-auth), не типы домена.

**FormValues vs Request типы.** Одна zod-схема даёт два типа — `.default()` / `.transform()` делают `z.input` и `z.output` несовместимыми:

- `z.input<typeof schema>` — форма данных **до** валидации, для `defaultValues` формы.
- `z.output<typeof schema>` — форма **после** валидации (default применён, transform отработал), для submit / отправки на сервер.

Это ось «стадия валидации», не «HTTP request/response». Тип сущности из ответа — отдельный (`LobbyTable`), не `z.output` инпут-схемы.

Схема формы может **расширять** доменную схему полем, которого нет в снапшоте (пароль стола: сервер принимает его отдельно и никогда не кладёт в состояние стола) — см. `features/lobby/create-table/model/create-table-form.ts`.

---

## 15. Формы — react-hook-form + zodResolver

`register` в React Native не работает: у `TextInput` нет DOM-события `change`, которое RHF вешает под капотом. **Каждое поле оборачивается в `Controller`.**

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

- Схема — в `@durak-master/schemas`, не inline в форме. Схема, специфичная для формы, — в `model/` слайса.
- `control` передаётся в подкомпонент полей типизированным (`Control<CredentialsInput>`), не `any`.
- Server-side ошибки — `setError('root', { message })`; сообщения better-auth приходят на английском, показываем свой перевод.
- Форма, доходящая до низа экрана, оборачивается в `KeyboardAvoidingView` с `behavior={Platform.OS === 'ios' ? 'padding' : 'height'}`, а прокрутка — `ScrollView` с `keyboardShouldPersistTaps="handled"`, иначе первое нажатие только убирает клавиатуру.
- Примеры: `features/auth/sign-in`, `features/lobby/create-table`.

---

## 16. Conditional render — ts-pattern

3+ ветки render → `match`, не вложенные `if (...) return <X />` и не цепочки тернарников в JSX.

Что матчить — два варианта, оба ОК:

**A. На одном значении-дискриминанте:**

```tsx
import { match } from 'ts-pattern';

const title = match(tab)
  .with('profile', () => t('nav.profile'))
  .with('tables', () => t('lobby.title'))
  .with('create', () => t('create.title'))
  .exhaustive();
```

`.exhaustive()` даёт TS-ошибку если добавили вариант union но забыли case.

**B. На объекте флагов.** `match` прямо на `{ ...поля }`, паттерны через `P.nullish` / `P.string` и т.п. Берём когда веток немного и отдельный хук-слой был бы лишней церемонией:

```tsx
import { match } from 'ts-pattern';

const tone = match({ isWinner, isDraw })
  .with({ isWinner: true }, (): ResultTone => 'win')
  .with({ isDraw: true }, (): ResultTone => 'draw')
  .otherwise((): ResultTone => 'lose');
```

Порядок `.with` важен — первый совпавший паттерн выигрывает. Узкие значения в хендлерах
бери из аргумента `match` (он narrowed), не из замыкания и не через `as` — каст обходит
проверку типов.

**Запрещено в любом случае** — `if`/тернарник-цепочки, собирающие JSX:

```tsx
// ✗ НЕ ОК — condition hell в view
return !tableId ? null : isLoading ? <Loading /> : !table ? <NotFound /> : <Table />;
```

**Когда выносить в хук:** сборка state переиспользуется в 2+ местах, либо тело логики
настолько объёмно, что view перестаёт читаться. Иначе вариант B инлайн в view — норма.

### 15.1 Одна ветка — `&&`, не `? : null`

Рендер «есть/нет» (одна ветка, иначе ничего) — `cond && <X />`, не `cond ? <X /> : null`:

```tsx
// ✗ НЕ ОК — лишний : null
{footer ? <View style={styles.footer}>{footer}</View> : null}

// ✓ ОК
{footer && <View style={styles.footer}>{footer}</View>}
```

Инверсия `cond ? null : <X />` → `!cond && <X />`.

**Условие обязано быть `boolean`.** `&&` рендерит левый операнд как есть — для
не-boolean falsy (`0`, `''`, `NaN`) RN попытается отрисовать его как текст вне `<Text>`
и **упадёт в рантайме** (в вебе это был бы просто мусорный «0» в разметке).
Числовые/строковые проверки сначала приводим к boolean:

```tsx
// ✗ ОПАСНО — при пустой руке крэш
{cards.length && <PlayerHand cards={cards} />}

// ✓ ОК — явная boolean-проверка
{cards.length > 0 && <PlayerHand cards={cards} />}
{!isEmpty(cards) && <PlayerHand cards={cards} />}   // isEmpty из remeda
```

Безопасны как условие: boolean-флаги (`isActive`), сравнения (`x === y`),
`!x`, `!!x`, объект/`undefined` (`errors.email`), `isEmpty()`/`isNonNullish()`.

Тернарник остаётся для **двух** реальных веток (`cond ? <A /> : <B />`).

---

## 17. Анимации — Reanimated

`react-native-reanimated` v4. Анимации идут на UI-потоке, поэтому не встают вместе с JS.

**Появление/исчезание/перестановка** — декларативные пресеты на `Animated.View`:

```tsx
import Animated, { FadeOut, LinearTransition, SlideInRight } from 'react-native-reanimated';

<Animated.View
  key={key}
  entering={SlideInRight.springify().damping(30).stiffness(380)}
  exiting={FadeOut.duration(160)}
  layout={LinearTransition.springify().damping(30).stiffness(380)}
/>;
```

`layout` обязателен там, где элементы меняются местами (рука игрока): без него соседи перепрыгивают скачком.

**Непрерывное значение** — `useSharedValue` + `withTiming` / `withSpring`, читается в `useAnimatedStyle` / `useAnimatedProps`:

```tsx
const progress = useSharedValue(value);

useEffect(() => {
  progress.value = withTiming(value, { duration: duration.panel });
}, [value, progress]);

const animatedProps = useAnimatedProps(() => {
  return { text: `${Math.round(progress.value)}` };
});
```

Длительности — из `duration` в `@/ui-kit`, не литералами.

`key` у анимируемых элементов списка должен быть стабильным и доменным (`cardKey(card)`), не индексом: по индексу Reanimated считает, что карта осталась той же, и анимация перестановки не проигрывается.

---

## 18. Переводы — i18next

`react-i18next`, один namespace (`translation`), ключ передаётся целиком:

```tsx
const { t } = useTranslation();

<Text>{t('table.take')}</Text>;
```

- **Никакого `useTranslations('namespace')`** — namespace в проекте один, префикс входит в ключ.
- **Ключи типизированы** по `ru.json` через аугментацию `CustomTypeOptions` (`shared/i18n/i18next.d.ts`): опечатка в ключе — ошибка компиляции, а не сырой идентификатор на экране. Русский файл — источник истины, английский может отставать.
- **Интерполяция — двойные скобки**: `t('result.rating', { value: ratingDelta })` для `"rating": "Рейтинг +{{value}}"`.
- **Плюрализация — суффиксы ключей**, не ICU-синтаксис. Формы считает `Intl.PluralRules`:

  ```jsonc
  // ru.json — три формы
  { "cards": { "count_one": "{{count}} карта", "count_few": "{{count}} карты", "count_many": "{{count}} карт" } }

  // en.json — две
  { "cards": { "count_one": "{{count}} card", "count_other": "{{count}} cards" } }
  ```

  ```tsx
  <Text>{t('cards.count', { count: hand.length })}</Text>
  ```

- Локали — `apps/mobile/shared/i18n/locales/{ru,en}.json`. Ключ, добавленный только в `ru.json`, типы пропустят, но на английском экран покажет идентификатор — правь оба файла в одном коммите.
- Язык восстанавливается асинхронно в `app/_layout.tsx` (`restoreLocale`): приложение стартует на языке по умолчанию, первый кадр не ждёт диска. Смена — `changeLocale(locale)`, выбор переживает перезапуск.
- Ключ, собираемый в конфиге, типизируется `ParseKeys` из `i18next` (`TabBar.config.ts`), не `string`.

---

## 19. Сервер

Этот гайд покрывает `apps/mobile/`. Инварианты проекта (авторитетность сервера, криптослучайность, `PlayerView`) — в [`CLAUDE.md`](../CLAUDE.md). Правила игры — в [`docs/game-rules.md`](./game-rules.md), их реализация — `packages/game-core`.

---

## 20. Запреты

- `console.log` в коммите. ESLint `no-console: warn` (разрешены `console.warn` / `console.error`; в `**/scripts/**` правило off — там консоль это вывод CLI).
- `any` — используй `unknown`. Правило `ts/no-explicit-any: error` включено в `eslint.config.mjs`.
- Non-null assertion `!` без обоснования — `ts/no-non-null-assertion: warn`.
- Deep imports мимо barrel.
- Cross-import между слайсами одного слоя.
- Biome, Stylelint, CSS-in-JS. Только ESLint + Prettier + `StyleSheet`.
- Литеральные цвета, отступы и длительности в компонентах. Только токены из `@/ui-kit`.
- Голая строка вне `<Text>` — крэш в рантайме.
- Несколько стилей с `transform` в одном массиве — сложи в один.
- `register` из react-hook-form. В RN только `Controller`.
- Дублирование схем client/server. Только `@durak-master/schemas`.
- `useState` для form fields. Только `react-hook-form`.
- Объектный селектор Zustand (`useStore((s) => ({ a: s.a, b: s.b }))`) — новая ссылка каждый рендер.
- `ScrollView` + `.map()` для длинных списков. `FlatList` / `FlashList`.
- Вложенные `if (...) return <X />` на 3+ ветки. Используй `ts-pattern match`.
- Что-либо кроме роут-файлов в `apps/mobile/app/` (см. [`docs/fsd.md`](./fsd.md) §1).
- `'use client'` — директива Next.js, в Expo не значит ничего.

---

## 21. Чек-лист перед коммитом

```bash
bun fix          # lint:fix + format — автофиксы ESLint и форматирование Prettier
bun lint         # должно быть 0 errors/warnings
bun format:check # форматирование без изменений
bun typecheck    # типы по всем воркспейсам
bun verify       # typecheck + lint + format:check одной командой
```

`bun fix` не чинит: пустые строки (секция 13), порядок хуков (секция 9.1), FSD-границы импортов (→ [`docs/fsd.md`](./fsd.md)), полноту переводов (секция 18).
