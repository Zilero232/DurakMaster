# Naming

Part of the [style guide](../README.md).

## 5. Naming

| What                     | How                  | Example                               |
| ------------------------ | -------------------- | ------------------------------------- |
| Slices                   | kebab-case           | `durak-table`, `create-table`         |
| Segments                 | kebab-case           | `ui`, `model`, `lib`, `api`, `config` |
| Component folder         | PascalCase           | `DurakTable/`, `BetPicker/`           |
| Component file           | PascalCase + `.tsx`  | `CreateTable.tsx`                     |
| Types file               | `<Name>.types.ts`    | `CreateTable.types.ts`                |
| Styles file              | `<Name>.styles.ts`   | `Button.styles.ts`                    |
| Layout constants file    | `<Name>.config.ts`   | `AppShell.config.ts`                  |
| Hook file                | kebab-case           | `use-online-game.ts`                  |
| React component (export) | PascalCase           | `CreateTable`                         |
| Hook                     | `use` + camelCase    | `useOnlineGame`, `useSessionStore`    |
| Utility                  | camelCase            | `sortHand`, `cardKey`                 |
| Props type               | `<Name>Props`        | `CreateTableProps`                    |
| Function input type      | `<Name>Input`        | `FanOverlapInput`, `UseCardSizeInput` |
| DTO type                 | `<Name>Input/Output` | `CredentialsInput`                    |
| Server file              | kebab-case + role    | `rooms.service.ts`, `auth.guard.ts`   |

Boolean names read as a question: `isReady`, `hasStakeHeld`, `canStart`.

> FSD canon: kebab-case for all files. DurakMaster deviation: PascalCase for component folders and files, kebab-case for hooks/utilities.
