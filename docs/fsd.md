# Feature-Sliced Design — DurakMaster

FSD-методология для `apps/mobile/`. Этот документ — рабочая справка по архитектуре клиента: иерархия слоёв, правила импортов, публичные API, сегменты.

Полная спецификация: [feature-sliced.design](https://feature-sliced.design). Линтер FSD-правил: [Steiger](https://github.com/feature-sliced/steiger).

> **Расхождения с каноном FSD в этом проекте** (осознанные, см. причины ниже):
>
> | Канон FSD | DurakMaster | Почему |
> |---|---|---|
> | Корень `src/` | Слои лежат прямо в `apps/mobile/`, алиас `@/` → `apps/mobile/` | Единая структура с остальными клиентами компании: лишний уровень `src/` не несёт смысла, импорты короче — `@/ui-kit`. |
> | Слой `pages/` | Слой `views/` | Имя `pages` уже занято смыслом «экран маршрута» в Expo Router; `views/` не путается с каталогом `app/`. |
>
> Везде ниже, где канон говорит `pages` или `src/pages` — у нас `views`. Где говорит `src/` — у нас корень `apps/mobile/`.

---

## 1. Иерархия слоёв (сверху вниз)

| # | Слой | Назначение | Слайсы? |
|---|---|---|---|
| 1 | App | Маршруты Expo Router, провайдеры, entrypoint | Нет |
| 2 | Views *(канон: Pages)* | Целые экраны / композиции уровня маршрута | Да |
| 3 | Widgets | Крупные самодостаточные UI-блоки (переиспользуемые или независимые) | Да |
| 4 | Features | Пользовательские интеракции с бизнес-ценностью (формы, действия) | Да |
| 5 | Entities | Базовые бизнес-понятия (session, settings, game) | Да |
| 6 | Shared | Сокет-клиент, утилиты, i18n, конфиг, мост к нативному — project-agnostic | Нет |
| — | UI-kit | Дизайн-система: примитивы, составные компоненты, иконки, токены | Нет |

Слой `Processes` устарел — его содержимое переносится в `Features` или `App`.

`UI-kit` вне нумерации: он не встроен в цепочку, а лежит **под** ней. Импортировать его вправе
любой слой — от `App` до `Shared`; сам он не импортирует ни один из них (см. §2).

### Структура директорий

```
apps/mobile/
├── app/                # Слой App — каталог маршрутов Expo Router
│   ├── _layout.tsx     # провайдеры, шрифты, восстановление языка
│   ├── index.tsx       # единственный экран приложения
│   └── +not-found.tsx  # несуществующий маршрут
├── views/              # Слой Views (канон: pages/)
│   └── <view-name>/
├── widgets/            # Слой Widgets
│   └── <domain>/       # game | lobby | profile | rules
│       └── <widget-name>/
├── features/           # Слой Features
│   └── <domain>/       # auth | game | lobby | settings
│       └── <feature-name>/
├── entities/           # Слой Entities
│   └── <entity-name>/
├── shared/             # Слой Shared (без слайсов — только сегменты)
│   ├── api/            # better-auth клиент, WebSocket-клиент
│   ├── config/         # env, адрес сервера
│   ├── i18n/           # i18next, локали, типизация ключей
│   ├── lib/            # format, haptics, sound, time
│   └── platform/       # мост к @durak-master/platform
└── ui-kit/             # Дизайн-система (без слайсов — только сегменты)
    ├── primitives/     # базовые: Button, Avatar, Sheet
    ├── components/     # составные: PlayingCard, StatusScreen
    ├── icons/          # SuitIcon
    ├── lib/            # утилиты карты, контекст отклика на нажатие
    └── theme/          # токены, размеры от экрана, темы колоды
```

> **Доменная группировка слайсов.** В DurakMaster слайсы внутри `features/` и `widgets/` сгруппированы по бизнес-домену (`auth`, `game`, `lobby`, `profile`). Это надстройка поверх FSD-канона (`<layer>/<slice>/`). Импорты: `@/features/auth/sign-in`, `@/widgets/lobby/table-list`. Слой `entities/` пока плоский — слайсов мало (`session`, `settings`, `game`), доменная прослойка была бы лишней.

### Каталог `app/` — только маршруты

**Expo Router считает маршрутом любой файл в `app/`.** Положенный рядом `AppShell.styles.ts` или `AppShell.types.ts` превратится в экран `/AppShell.styles`, а `_layout.tsx` попытается его отрисовать.

Поэтому в `app/` лежат **только** роут-файлы: `_layout.tsx`, `index.tsx`, `+not-found.tsx`. Никаких `.styles.ts`, `.types.ts`, `components/`, хелперов. Всё остальное — в слоях рядом с `app/`, включая стили самого лейаута:

```ts
// views/root-layout/root-layout.styles.ts
export const rootLayoutStyles = StyleSheet.create({ root: { flex: 1 } });
```

```tsx
// app/_layout.tsx
import { rootLayoutStyles } from '@/views/root-layout';
```

---

## 2. Золотое правило: направление импортов

```
App → Views → Widgets → Features → Entities → Shared
 └──────┴────────┴──────────┴───────────┴──────────┴──→ UI-kit
```

Модуль импортирует только из слоёв **строго ниже**. Запрещено:

- **Вверх** — Feature не может импортить из Widget или View.
- **Вбок внутри слоя** — один Feature не может импортить другой Feature.

**`ui-kit` — терминальный слой.** Его импортируют все, он — никого:

- Любой слой вправе импортить `@/ui-kit` — это не считается «вбок» и не нарушает направление.
- `ui-kit` **не импортирует ни `@/shared`, ни `@/entities`, ни любой другой слой** — ни одного `@/`-импорта, кроме себя. Из внешнего у него только npm-пакеты (`react-native`, `react-native-svg`, `lucide-react-native`, `react-i18next`, …) и типы карт из `@durak-master/schemas`.
- Нужное `ui-kit` от приложения приходит **сверху через контекст**, а не импортом (см. §5.1).

Правило односторонее не ради чистоты: как только примитив потянет `@/entities`, дизайн-система перестанет быть переносимой и любой её импорт начнёт тащить за собой стор и сокет.

**Исключение — cross-entity ссылки.** Когда Entity A нужен тип из Entity B, используй `@x`-паттерн: `entities/A/@x/B.ts` экспортирует только то, что B нужно от A.

---

## 3. Слайсы

Слайс — директория внутри слоя, названная по **бизнес-домену** (не по технической роли).

- ✓ Хорошо: `session`, `settings`, `table-list`, `create-table`, `sign-in`
- ✗ Плохо: `components`, `hooks`, `helpers`, `utils`

**Правила:**

- Каждый слайс изолирован — ноль связности с соседними слайсами того же слоя.
- Связанные слайсы можно группировать в подпапки, но они остаются независимыми.
- Имена слайсов — kebab-case.

**Доменные группы (DurakMaster):** слои `features/` и `widgets/` группируют слайсы по бизнес-домену:

- `auth/` — вход и регистрация (`sign-in`)
- `game/` — стол, карты, ход партии (`game-table`, `online-table`, `quick-phrases`, `view-discard`)
- `lobby/` — список столов, создание и вход за стол (`table-list`, `create-table`, `join-table`)
- `profile/` (только widgets) — кошелёк, меню профиля
- `settings/` (только features) — панель настроек
- `rules/` (только widgets) — панель правил

Доменная папка — организационный контейнер, **не публичный API**. Импорт всегда до уровня слайса: `@/features/lobby/create-table`, не `@/features/lobby`.

---

## 4. Сегменты

Сегменты организуют код внутри слайса по технической цели:

| Сегмент | Содержит |
|---|---|
| `ui/` | Компоненты, их стили и типы |
| `model/` | Типы, Zustand-сторы, схемы форм, хуки, бизнес-логика |
| `api/` | Запросы и подписки на сервер, мапперы данных |
| `lib/` | Внутренние утилиты только для этого слайса |
| `config/` | Фиче-флаги, константы, конфигурация |

Кастомные сегменты допустимы — называй по тому, **что делают**, не что они есть.
✗ Плохо: `hooks/`, `components/`. ✓ Хорошо: `model/`, `lib/`.

---

## 5. Публичный API (`index.ts`)

У каждого слайса — `index.ts` в корне, реэкспортирующий публичный интерфейс.

```ts
// entities/session/index.ts
export { sendGameAction, useSessionStore } from './model/session-store';
export { useOnlineGame } from './model/use-online-game';
export { SessionNotices } from './ui/SessionNotices';

export type { ConnectionStatus, GameOutcome } from './model/session-store';
```

**Правила:**

- **Без wildcard-экспортов** — `export * from './ui/Foo'` запрещён. Явно.
- **Минимальная поверхность** — экспортируй только то, что реально нужно другим слоям.
- **Внешние импорты — только через index слайса** — никогда `@/features/auth/sign-in/ui/SignInForm` напрямую. Всегда `@/features/auth/sign-in`.
- **Группа домена — не публичный API** — `@/features/auth` не существует, импортируется конкретный слайс. Доменная папка только организует файлы.
- **`model/` — barrel там, где есть что скрывать.** Плоский `model/` из одного-двух файлов импортируется по файлу (`./model/session-store`). Если внутри `model/` появились подпапки — barrel у каждой (`model/hooks/index.ts`, `model/contexts/index.ts`), slice-level `model/index.ts` не создаём. Подробнее — [`docs/style.md`](./style.md) §11.
- **Без циклических импортов** — не импортируй из собственного `index.ts` внутри слайса. Внутри — относительные пути.
- **`ui-kit/` — дизайн-система, отдельный слой рядом с `shared/`.** Сегменты `primitives/` (базовые), `components/` (составные), `icons/`, `lib/` (утилиты и контексты слоя), `theme/` (токены, размеры от экрана, темы колоды). **Каждый компонент — своя PascalCase-папка** (`primitives/Button/`, `components/PlayingCard/`, …) с файлами `Component.tsx`, `Component.styles.ts`, опционально `Component.types.ts` и обязательным barrel `index.ts`. Сегментные barrel (`primitives/index.ts`, …) и корневой `ui-kit/index.ts` реэкспортят всё. Снаружи — только `@/ui-kit`, не `@/ui-kit/primitives/Button`. Примитивы собраны из `react-native` (`View`, `Pressable`, `Text`, `Modal`); стили — `StyleSheet.create`, токены — из собственного `theme/`. Подробнее — [`docs/style.md`](./style.md) §2.1.

### 5.1. Контексты `ui-kit` — как слой получает данные, не импортируя слои

`ui-kit` не может прочитать Zustand-стор или дёрнуть `@/shared/lib/sound`: это импорт вверх (§2). Но и рисовать колоду без выбранной темы или кнопку без щелчка он тоже не должен. Развязка — **инверсия зависимости через контекст**: `ui-kit` объявляет провайдер и хук, приложение подставляет значение сверху.

Оба контекста построены на `createContext` из `@siberiacancode/reactuse` и экспортируются из `@/ui-kit`:

| Контекст | Провайдер / хуки | Кто подставляет значение |
|---|---|---|
| Тема колоды | `CardThemeProvider`, `useCardTheme`, `useSetCardTheme` | `app/_layout.tsx` — `initialValue` из стора настроек |
| Отклик на нажатие | `FeedbackProvider`, `usePressFeedback` | `app/_layout.tsx` — звук + вибрация из `shared/lib` |

```tsx
// app/_layout.tsx — приложение знает и про звук, и про стор; ui-kit — ни про что
const handlePressFeedback = () => {
  unlockSound();
  playSound('click');
  haptic('tap');
};

<FeedbackProvider initialValue={handlePressFeedback}>
  <CardThemeProvider initialValue={cardTheme}>{/* … */}</CardThemeProvider>
</FeedbackProvider>;
```

Что это даёт по каждому:

- **`usePressFeedback`** — `Button` вызывает его в `onPress` и даёт щелчок с вибрацией, ничего не зная про `expo-audio` и `expo-haptics`. Дефолт — noop, так что примитив рендерится и без провайдера (тесты, сторибук).
- **`useCardTheme`** — `PlayingCard` берёт рубашку из контекста, не читая `useSettingsStore`. Источник истины остаётся в `entities/settings` (там персист), контекст — лишь его проекция для отрисовки, поэтому `SettingsPanel` при смене темы зовёт **и** стор, **и** `useSetCardTheme`.

Правило: **новая зависимость `ui-kit` от приложения — это новый контекст, а не новый импорт.** Если примитиву понадобилось что-то из бизнес-слоёв, добавь провайдер в `ui-kit/lib/` (или `ui-kit/theme/`, если это оформление) и подставь значение в `app/_layout.tsx`.

---

## 6. Интеграция с Expo Router

`app/` — каталог маршрутов, роут-файлы тонкие и делегируют во `views/`:

```tsx
// app/index.tsx
import { useSessionStore } from '@/entities/session';
import { AppShell } from '@/views/app-shell';
import { OnlineTable } from '@/widgets/game/online-table';

const HomeScreen = () => {
  const currentTable = useSessionStore((store) => store.currentTable);

  return currentTable ? <OnlineTable /> : <AppShell />;
};

export default HomeScreen;
```

Роут-файлы — **единственное место с `export default`**: Expo Router требует именно его, иначе экран не найдётся. Всё остальное в проекте экспортируется именованно.

`_layout.tsx` держит провайдеры (`GestureHandlerRootView`, `SafeAreaProvider`, `QueryClientProvider`, `Toaster`) и загрузку шрифтов с языком — но не разметку экранов. Стили лейаута лежат во `views/root-layout` (см. §1: файл рядом стал бы маршрутом).

### Path-алиасы

`@/` указывает на `apps/mobile/` — корень воркспейса, где лежат и слои, и `app/`:

```jsonc
// apps/mobile/tsconfig.json
{ "compilerOptions": { "paths": { "@/*": ["./*"] } } }
```

Поэтому внутренние импорты начинаются сразу со слоя: `@/ui-kit`, `@/entities/session`.

---

## 7. Паттерны композиции

**View** *(канон: Page)*:

```
View
├── импортит Widget A (самодостаточный блок)
├── импортит Widget B
├── импортит Feature X (интерактивный элемент)
└── использует примитивы `@/ui-kit` для лейаута
```

**Widget:**

```
Widget
├── импортит Feature(s) для интерактивности
├── импортит Entity типы/компоненты для отображения
└── использует примитивы `@/ui-kit`
```

**Feature:**

```
Feature
├── импортит Entity типы/хуки для доменных данных
└── использует Shared API-клиент и утилиты, примитивы `@/ui-kit`
```

---

## 8. Чек-лист (проверять перед каждым изменением)

- [ ] Файл в правильной директории слоя
- [ ] В `app/` не появилось ничего, кроме роут-файлов
- [ ] Импорты идут только вниз — никогда вверх или вбок
- [ ] У слайса есть публичный `index.ts` с явными именованными экспортами
- [ ] Нет прямых импортов во внутренности слайса извне
- [ ] Имена директорий и файлов — kebab-case (исключение — папки компонентов: PascalCase)
- [ ] Функции-компоненты — именованные PascalCase-экспорты (`export default` только в `app/`)
- [ ] Сегменты описывают цель (`model/`, `api/`), не техническую роль (`hooks/`, `components/`)
- [ ] Роут-файлы — тонкие обёртки, делегируют во `views/`
- [ ] Слой Shared не содержит бизнес-логики — только project-agnostic код
- [ ] `ui-kit` не импортит другие слои — ни одного `@/shared`, `@/entities`, `@/features`
- [ ] Слой Entities не содержит UI-логики интеракций — это уровень Features

> **Naming в DurakMaster:** канон FSD требует kebab-case для всех файлов. DurakMaster-кодстайл (см. [`docs/style.md`](./style.md) §5): kebab-case для слайсов/сегментов, **PascalCase для папок и файлов компонентов** (`GameTable/GameTable.tsx`), camelCase для хуков/утилит. Это локальная конвенция поверх FSD.

---

## 9. Частые ошибки

| Ошибка | Фикс |
|---|---|
| `.styles.ts` / `.types.ts` рядом с роут-файлом в `app/` | Перенести в слой (`views/`, `widgets/`, …) — иначе Expo Router сделает из файла маршрут |
| Feature импортит из другого Feature | Вынести общую логику в Entities или Shared |
| View содержит бизнес-логику напрямую | Вынести в Feature, скомпоновать во View |
| `shared/lib/use-sign-in.ts` | Auth — бизнес-домен → `features/auth/sign-in/model/use-sign-in.ts` |
| Widget импортит из View | Инвертировать: View импортит Widget |
| Слайс экспортит всё через `export *` | Явные именованные реэкспорты |
| Папка `components/` в корне слоя | Классифицировать: это Widget, Feature, Entity или `ui-kit`? |
| Примитив в `ui-kit` импортит `@/entities` или `@/shared` | Инвертировать: провайдер в `ui-kit`, значение из `app/_layout.tsx` (§5.1) |
| `import { Button } from '@/ui-kit/primitives/Button'` | Только `@/ui-kit`; нет в barrel — дописать строку в `ui-kit/index.ts` |
| Роут-файл содержит полную реализацию экрана | Перенести во `views/<name>/`, роут — тонкая обёртка |

---

## Дополнительно

- Полная спецификация: [feature-sliced.design](https://feature-sliced.design)
- Линтер FSD-правил: [Steiger](https://github.com/feature-sliced/steiger)
- Cross-entity паттерн `@x` — секция 2 выше
- Кодстайл DurakMaster поверх FSD (структура слайса, naming, стили, размер компонента): [`docs/style.md`](./style.md)
