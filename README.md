# DurakMaster

Онлайн-дурак: подкидной и переводной, 2–6 игроков, колоды 24/36/52.
Web, десктоп (Windows/macOS/Linux) и мобильные (Android/iOS) из одной кодовой базы.

## Стек

| Слой | Технология |
|---|---|
| Клиент | Next.js 16, React 19, TanStack Query, SCSS-модули, base-ui, motion, next-intl |
| Стол | DOM/CSS + motion (без канваса) |
| Realtime | `partysocket` ↔ `ws` + `@nestjs/platform-ws` |
| API | NestJS 11 на Bun, Prisma 7, PostgreSQL, better-auth, nestjs-zod |
| Правила игры | `packages/game-core` — чистые функции без зависимостей |
| Состояние столов | В памяти ноды, снапшот в Postgres на границах ходов |
| Директория/pub-sub | Valkey |
| Все платформы | Tauri 2 |

**Почему стол на DOM, а не на канвасе.** 40 карт укладываются в CSS-композитинг,
а канвас в WebView приносит лимит памяти 256 МБ на iOS, потерю WebGL-контекста
без авто-восстановления и необходимость bitmap-шрифтов для кириллицы.
`motion` — 42 КБ gzip против 156 КБ у PixiJS.

## Быстрый старт

```bash
bun install                                  # зависимости
cp apps/server/.env.example apps/server/.env # заполнить BETTER_AUTH_SECRET
bun dev:infra                                # Postgres + Valkey + Mailpit
bun --filter @durak-master/server db:migrate # схема БД
bun dev                                      # http://localhost:3000
```

Почта разработки: http://localhost:8025 (Mailpit).

## Команды

```bash
bun dev            # server + client
bun typecheck      # типы по всем пакетам
bun lint:fix       # Biome
bun lint:css:fix   # Stylelint
bun build          # продакшен-сборка

bun tauri:dev      # десктоп
bun android:dev    # Android
bun android:build  # AAB для Google Play
```

## Структура

```text
apps/
├── client/     Next.js, FSD-архитектура
├── server/     NestJS API + игровые комнаты
└── tauri/      оболочка для десктопа и мобильных
packages/
├── schemas/    Zod-схемы, общие для клиента и сервера
├── game-core/  правила дурака — чистые, тестируемые без сети
└── platform/   абстракция нативного: покупки, пуши, хранилище
docs/
├── game-rules.md   формализованные правила — источник истины
├── fsd.md          архитектура клиента
├── style.md        стиль кода
└── play-store/     релиз в сторы
```

## Документация

- [Правила игры](docs/game-rules.md) — читать перед правками `game-core`
- [FSD](docs/fsd.md) — архитектура клиента
- [Стиль кода](docs/style.md)
- [CLAUDE.md](CLAUDE.md) — инварианты проекта

## Лицензия

Проприетарный проект.
