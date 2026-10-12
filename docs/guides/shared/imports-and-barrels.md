# Imports and barrels

Part of the [style guide](../README.md).

## 6. Imports

### Aliases

`@/` → the `apps/mobile/` root, where the layers live: `@/ui-kit`, `@/entities/session`. Used for everything except relative imports within the same slice. The server has no alias — relative imports between its folders.

### Group order

Sorted by `perfectionist/sort-imports` from `@siberiacancode/eslint` (`bun lint:fix`), **with a blank line between groups**. Group order:

1. **External types** — `import type` from packages.
2. **External value imports** — `node:` builtins and packages (`react`, `react-native`, `@siberiacancode/*`, `@durak-master/*`).
3. **Types from aliases** — `import type` from `@/`.
4. **Value imports from aliases** — `@/` paths (`internalPattern`: `^@/.+`, `^~/.+`).
5. **Relative types** — `import type` from `./` `../`.
6. **Relative value imports** — `./` `../`, including `*.styles`.
7. **Side-effect imports** — `import 'reflect-metadata'`.

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

`ui-kit` has a single root barrel `@/ui-kit` (the `primitives/`, `components/`, `hooks/`, `icons/`, `theme/` segments are under the hood). Tokens, rendering helpers and deck themes come from there too: `import { colors, rankLabel, CARD_THEMES } from '@/ui-kit'`. Inside `ui-kit`, relative imports are OK.

A component not re-exported from the root barrel is a gap in the barrel, not permission for a deep import: add the line to `ui-kit/index.ts` rather than a path to the folder at the call site.

`shared/` has segments rather than slices, and they are imported by path on purpose: `@/shared/lib/cards`, `@/shared/api`, not one barrel over the whole layer.

Steiger (`bun lint:fsd`) catches upward and cross-slice imports; ESLint does not look at FSD boundaries, and nothing checks `ui-kit` purity — that is caught at review.

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

export { FeedbackProvider, usePressFeedback } from './feedback-context';
```

**A subsystem in `model/`:** if a hook or a store is assembled from several files in a subfolder, the `index.ts` next to them exports only the public entry point. Internal modules and types do not go outside.

```ts
// features/lobby/create-table/model/index.ts
export {
  clampPlayersToGame,
  CREATE_TABLE_DEFAULTS,
  createTableFormSchema,
  toTableSettings
} from './create-table-form';

export type { CreateTableFormValues } from './create-table-form';

export { useCreateTableForm } from './hooks';
```

Wildcard exports (`export * from`) are forbidden. Explicit named ones only. The one allowed shorthand is `export type * from` in the `model/hooks` barrels (`export type * from './use-card-gesture.types'`) — it re-exports types only, never values.

**The only exception for `export default`** is route files in `apps/mobile/app/`: Expo Router requires a default export, otherwise the screen is not found.

The server follows the same rule: a module's `index.ts` exports its Nest module, the services
other modules inject, and the types they need — nothing else.
