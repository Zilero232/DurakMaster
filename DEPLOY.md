# Deploying DurakMaster

## What runs where

| Component     | Where       | Updated by                                     |
| ------------- | ----------- | ---------------------------------------------- |
| Web client    | VPS, Caddy  | CI: `deploy.yml`                               |
| API + sockets | VPS, Docker | CI: `deploy.yml`                               |
| Database      | VPS, Docker | the same job                                   |
| Android       | RuStore     | CI: `release.yml`                              |
| iOS           | App Store   | planned — EAS builds it, no submit profile yet |

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
| `DEPLOY_SSH_PASSWORD` | the VPS password — the workflow authenticates with it     |
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

## Migrations

The initial migration is committed, and the deploy runs `migrate deploy` against
it — nothing to prepare before the first deploy.

After changing `schema.prisma`, create the migration locally and commit it
together with the schema:

```bash
bun --filter @durak-master/server db:migrate
```

A schema change without its migration will not reach production: `migrate deploy`
only applies what is committed.

---

## After a deploy

```bash
docker compose ps                  # all three containers healthy
docker compose logs -f server      # started without errors
curl https://api.durakmaster.ru/health
```

Then open `https://durakmaster.ru`, sign in, and play a deal against a bot.

---

## Releasing to RuStore

The `release` workflow publishes to RuStore when its `rustore` input is on: it
downloads the finished EAS build and pushes it through the RuStore Public API
(`bun run publish:rustore`).

### Secrets

| Secret                  | What it is                             |
| ----------------------- | -------------------------------------- |
| `RUSTORE_KEY_ID`        | key id from RuStore Console            |
| `RUSTORE_PRIVATE_KEY`   | the matching RSA private key, PEM      |
| `RUSTORE_CONTACT_EMAIL` | developer contact shown on the listing |

### One-time setup in the Console

The API cannot do these — they are done once by hand:

1. Create the app entry with the `com.durakmaster.app` package name.
2. Generate an API key pair, scope it to this app, and put the halves into the
   secrets above.
3. Upload the signing key: RuStore does **not** sign for you and cannot recover a
   lost key. Encrypt the keystore with RuStore's PEPK tool, upload the ZIP, and
   upload the upload-key certificate as `.pem`. Every later version must carry the
   same signature or the upload is rejected.

EAS holds that keystore — export it with `eas credentials` and keep it somewhere
you will still have it in a year.

The version lands as a draft awaiting moderation. `RUSTORE_PUBLISH_TYPE` chooses
what happens after review: `MANUAL` (default) waits for a button in the Console,
`INSTANTLY` goes live on its own.
