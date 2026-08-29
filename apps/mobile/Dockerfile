# syntax=docker/dockerfile:1
#
# DurakMaster web client — the Expo bundle exported for the browser, served by
# Caddy.
#
# Build from the monorepo root: the client imports the `schemas`, `game-core`
# and `platform` workspace packages.
#
#   docker build -f apps/mobile/Dockerfile -t durakmaster-web \
#     --build-arg EXPO_PUBLIC_API_URL=https://api.durakmaster.ru .
#
# EXPO_PUBLIC_* values are compiled into the bundle, so they arrive as build
# args rather than runtime env. They are not secrets — they ship to the browser.

FROM oven/bun:1.3.1 AS build
WORKDIR /app

ARG EXPO_PUBLIC_API_URL
ENV EXPO_PUBLIC_API_URL=${EXPO_PUBLIC_API_URL}

# Manifests first, so this layer is cached until a package.json changes.
COPY package.json bun.lock ./
COPY apps/mobile/package.json ./apps/mobile/package.json
COPY apps/server/package.json ./apps/server/package.json
COPY packages/game-core/package.json ./packages/game-core/package.json
COPY packages/platform/package.json ./packages/platform/package.json
COPY packages/schemas/package.json ./packages/schemas/package.json

RUN bun install --frozen-lockfile --ignore-scripts

COPY packages ./packages
COPY apps/mobile ./apps/mobile

# build:web sets NODE_ENV=production, which is what strips testID out of the
# bundle — see apps/mobile/babel.config.js.
RUN bun --filter @durak-master/mobile build:web

# ── runtime ──────────────────────────────────────────────────────────────────
# Caddy serves the export and terminates TLS. It also proxies the API subdomain,
# so this is the only container published to the internet.
FROM caddy:2-alpine AS runner

COPY infra/caddy/Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/apps/mobile/dist /srv/www

EXPOSE 80 443
