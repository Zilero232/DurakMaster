# CLAUDE.md

Guidance for Claude Code when working in this repo. Keep it short, link out for details.

## What this is

DurakMaster — онлайн-дурак (web + desktop + mobile). Монорепо на Bun workspaces.

- **Web client**: Next.js 16 / React 19 (`apps/client/`)
- **Desktop + mobile**: Tauri 2 (Rust) оборачивает тот же клиент (`apps/tauri/`)
- **API**: NestJS на Bun + Prisma 7 + Postgres, авторизация через better-auth (`apps/server/`)
- **Realtime**: сырой WebSocket (`ws` + `@nestjs/platform-ws`), состояние столов в памяти ноды
- **Правила игры**: чистый пакет `packages/game-core/` — без транспорта, БД и вендоров
- **Общие типы**: Zod-схемы в `packages/schemas/` (`@durak-master/schemas`)

## Layout

```text
apps/
├── client/          # Next.js — FSD-архитектура (docs/fsd.md)
├── server/          # NestJS API — modules/, lib/, core/, common/
└── tauri/           # Rust-оболочка (src/), capabilities/, tauri.conf.json
packages/
├── schemas/         # Zod-схемы (@durak-master/schemas), общие для клиента и сервера
├── game-core/       # Правила дурака: чистые функции (state, action) => state
└── platform/        # Абстракция нативного: покупки, пуши, хранилище
docs/
├── fsd.md           # Архитектура клиента — читать перед структурными правками
├── style.md         # Стиль кода, порядок импортов, именование
├── game-rules.md    # Формализованные правила дурака — источник истины для game-core
└── play-store/      # Релиз в сторы: листинг, приватность, подпись
infra/               # Конфиги инфраструктуры
```

## Инварианты, которые нельзя нарушать

Это не стилевые пожелания — нарушение любого пункта ломает игру или безопасность.

1. **`packages/game-core` не импортирует ничего, кроме `@durak-master/schemas`.**
   Ни NestJS, ни Prisma, ни React, ни `ws`. Это то, что делает правила тестируемыми
   без сети и позволяет сменить хостинг/транспорт, не переписывая игру.

2. **Случайность только криптографическая и только на сервере.**
   `crypto.randomInt()`, никогда `Math.random()`. Клиент не тасует колоду и не решает
   исход — он лишь заявляет намерение.

3. **Порядок колоды никогда не уходит клиенту.**
   Сервер отдаёт `PlayerView` — свою руку целиком, у остальных только счётчики,
   от колоды только размер. Скрывать карты на клиенте недопустимо: их видно в трафике.

4. **Сервер авторитетен.** Любое действие валидируется против состояния до применения.
   `expectedVersion` защищает от гонок и повторов.

5. **Монеты не переводятся между игроками.** Переводы создают серый рынок и риск
   переклассификации в азартную игру сторами.

## Команды

```bash
bun install                # зависимости всех воркспейсов
bun dev:infra              # Postgres + Valkey + Mailpit в Docker
bun dev                    # server + client параллельно
bun typecheck              # проверка типов по всем пакетам
bun lint:fix               # Biome
bun lint:css:fix           # Stylelint
bun tauri:dev              # десктоп-оболочка
bun android:dev            # Android
```

## Порядок работы

Правила игры — источник частых и дорогих багов. Перед изменением `game-core`
читать `docs/game-rules.md`: там зафиксированы формулировки, включая места,
где источники расходятся, и типовые ошибки реализации.
