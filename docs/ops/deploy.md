# Deploying DurakMaster

The API on a VPS and the Android app on Google Play. Part of the [documentation index](../README.md);
running everything locally is [local-dev.md](local-dev.md).

## What runs where

| Component     | Where       | Updated by                                     |
| ------------- | ----------- | ---------------------------------------------- |
| HTTPS proxy   | VPS, Caddy  | CI: `deploy.yml`                               |
| API + sockets | VPS, Docker | CI: `deploy.yml`                               |
| Database      | VPS, Docker | the same job                                   |
| Android       | Google Play | CI: `release.yml`                              |
| iOS           | App Store   | planned — EAS builds it, no submit profile yet |

Everything is built in GitHub Actions and pushed to ghcr.io. **The VPS builds
nothing** — it only pulls ready images.

There is no web client: `apps/mobile` ships only as the Android and iOS apps.

---

## API deploy

Actions → deploy → Run workflow. Manual, not on every commit.

What happens:

1. The `durakmaster-server` image (NestJS on Bun) is built and pushed to ghcr.io.
2. `docker-compose.yml` and `infra/caddy/Caddyfile` are copied to the VPS.
3. The VPS pulls, restarts, reloads Caddy, waits for the API to report healthy,
   then applies Prisma migrations.

### Secrets

Settings → Secrets and variables → Actions:

| Secret                | What it is                                                |
| --------------------- | --------------------------------------------------------- |
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
- `PUBLIC_URL=https://api.durakmaster.ru` — the origin avatar URLs are built from. It falls back
  to `BETTER_AUTH_URL` when unset, which is only correct while the two agree

### DNS

An A-record for `api.durakmaster.ru` pointing at the VPS. Ports 80 and 443 open — 80 is what Let's Encrypt uses to
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

Then install a build pointed at production, sign in on two devices with two accounts, and play a
two-seat deal — bots are refused outside development (`BOTS_DISABLED`).

---

## Releasing to Google Play

The `release` workflow builds one App Bundle. With the `play` input on and the
`production` profile it also runs `eas submit`, which uploads that bundle to the
**internal** track as a **draft** — nothing reaches testers until you promote it
in the Console.

The store-facing paperwork — listing copy, data answers, checklists — lives in
[docs/store/](../store/README.md).

### Secrets

| Secret                        | What it is                               |
| ----------------------------- | ---------------------------------------- |
| `GOOGLE_PLAY_SERVICE_ACCOUNT` | the service account JSON key, whole file |

CI writes it to `apps/mobile/google-play-key.json` — the path `eas.json` points
at — and deletes it afterwards, pass or fail. The same file goes there by hand
for a local `eas submit`; it is gitignored.

### One-time setup in the Console

1. Create the app entry with the `com.durakmaster.app` package name.
2. Enrol in Play App Signing and upload the certificate exported from
   `eas credentials`. Google holds the real signing key; EAS holds the upload
   key, and it must never be regenerated.
3. Play Console → **Setup → API access**: link a Google Cloud project, create a
   service account there, create a JSON key for it.
4. Play Console → **Users and permissions**: invite that service account and
   grant it release rights for this app. A fresh grant takes up to 24 hours.

### Rewarded ads

The reward for a rewarded ad is granted only by AdMob's server-side verification callback,
`GET https://api.durakmaster.ru/ads/admob-callback`. Set it on every rewarded ad unit in the
AdMob console — the Android one now, the iOS one when it exists — and press **Verify URL**.
The API must be reachable from Google over HTTPS; there is no secret to configure. Details in
[docs/store/google-play.md](../store/google-play.md#server-side-verification).

The Data safety form, content rating and ads declaration are answered from
[docs/store/data-safety.md](../store/data-safety.md); the rest of the Play
specifics are in [docs/store/google-play.md](../store/google-play.md).
