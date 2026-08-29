# Deploying DurakMaster

## What runs where

| Component     | Where       | Updated by        |
| ------------- | ----------- | ----------------- |
| Web client    | VPS, Caddy  | CI: `deploy.yml`  |
| API + sockets | VPS, Docker | CI: `deploy.yml`  |
| Database      | VPS, Docker | the same job      |
| Android       | Google Play | CI: `release.yml` |

Everything is built in GitHub Actions and pushed to ghcr.io. **The VPS builds
nothing** — it only pulls ready images.

There is one client: `apps/mobile` is exported both to the web and to the app.

---

## Web deploy

Actions → deploy → Run workflow. Manual, not on every commit.

What happens:

1. Two images are built — `durakmaster-web` (the Expo export behind Caddy) and
   `durakmaster-server` (NestJS on Bun) — and pushed to ghcr.io.
2. `docker-compose.yml` is copied to the VPS.
3. The VPS pulls, restarts, waits for the API to report healthy, then applies
   Prisma migrations.

### Secrets

Settings → Secrets and variables → Actions:

| Secret                | What it is                                                |
| --------------------- | --------------------------------------------------------- |
| `EXPO_PUBLIC_API_URL` | the API address, baked into the bundle at build time      |
| `DEPLOY_SSH_HOST`     | the VPS                                                   |
| `DEPLOY_SSH_USER`     | the user                                                  |
| `DEPLOY_SSH_KEY`      | private key — preferred                                   |
| `DEPLOY_SSH_PASSWORD` | password, only when no key is set                         |
| `DEPLOY_PATH`         | where `docker-compose.yml` lives, e.g. `/opt/durakmaster` |

---

## One-time VPS setup

```bash
# docker + compose
curl -fsSL https://get.docker.com | sh

# the directory CI copies the compose file into
mkdir -p /opt/durakmaster && cd /opt/durakmaster

# log in to ghcr so the host can pull the images
echo "$GHCR_TOKEN" | docker login ghcr.io -u <github-user> --password-stdin

# .env is written once by hand, from .env.example
nano .env
```

Production `.env` must carry:

- `NODE_ENV=production`
- `DATABASE_URL` — pointing at `postgres:5432` inside the compose network
- `DIRECT_URL` — the same value; only `prisma migrate deploy` reads it, the running app does not
- `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` — read by the database container
- `BETTER_AUTH_SECRET` — a fresh one, never the example value
- `BETTER_AUTH_URL=https://api.durakmaster.ru`
- `CORS_ORIGINS=https://durakmaster.ru` — the same value gates the WebSocket handshake
- `PUBLIC_URL=https://api.durakmaster.ru` — the origin avatar URLs are built from. It falls back
  to `BETTER_AUTH_URL` when unset, which is only correct while the two agree

### DNS

A-records pointing at the VPS: `durakmaster.ru`, `www.durakmaster.ru`,
`api.durakmaster.ru`. Ports 80 and 443 open — 80 is what Let's Encrypt uses to
prove the domain.

---

## The first migration

`apps/server/prisma/migrations/` is empty. Create the initial migration locally
and commit it before the first deploy:

```bash
bun --filter @durak-master/server db:migrate
```

Without it `migrate deploy` will not create the schema on production.

---

## After a deploy

```bash
docker compose ps                  # all three containers healthy
docker compose logs -f server      # started without errors
curl https://api.durakmaster.ru/health
```

Then open `https://durakmaster.ru`, sign in, and play a deal against a bot.

---

## Releasing to Google Play

A separate process — see [docs/play-store/](./docs/play-store/README.md).
