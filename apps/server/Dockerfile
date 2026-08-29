# syntax=docker/dockerfile:1
#
# DurakMaster API — NestJS on Bun, with the WebSocket gateway.
#
# Build from the monorepo root: the server imports the `schemas` and `game-core`
# workspace packages, so the context has to include them.
#
#   docker build -f apps/server/Dockerfile -t durakmaster-server .
#
# Bun runs the TypeScript directly — no compile step, only dependencies and the
# generated Prisma client.

FROM oven/bun:1.3.1 AS base
WORKDIR /app

# ── dependencies ─────────────────────────────────────────────────────────────
# Manifests first, so this layer is cached until a package.json changes.
# --frozen-lockfile checks the workspace against the lockfile, so every member
# listed there needs its manifest present, even the ones this image never runs.
FROM base AS deps

COPY package.json bun.lock ./
COPY apps/mobile/package.json ./apps/mobile/package.json
COPY apps/server/package.json ./apps/server/package.json
COPY packages/game-core/package.json ./packages/game-core/package.json
COPY packages/platform/package.json ./packages/platform/package.json
COPY packages/schemas/package.json ./packages/schemas/package.json

# --ignore-scripts: the server's postinstall runs `prisma generate`, which needs
# a schema that is not copied in yet. It runs explicitly below instead.
RUN bun install --frozen-lockfile --ignore-scripts

# ── runtime ──────────────────────────────────────────────────────────────────
FROM base AS runner

ENV NODE_ENV=production

# Bun nests dependencies under each workspace package, so the whole installed
# tree comes over to keep module resolution intact.
COPY --from=deps /app /app

COPY packages/game-core ./packages/game-core
COPY packages/schemas ./packages/schemas
COPY apps/server ./apps/server

WORKDIR /app/apps/server

# prisma.config.ts reads DIRECT_URL through env() and throws when it is unset.
# `generate` never opens a connection, so a placeholder satisfies it without
# baking a real credential into the image.
RUN DATABASE_URL="postgresql://placeholder" \
    DIRECT_URL="postgresql://placeholder" \
    bunx prisma generate

EXPOSE 4000

CMD ["bun", "src/main.ts"]
