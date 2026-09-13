# Deploying DurakMaster

## What runs where

| Component     | Where       | Updated by                                     |
| ------------- | ----------- | ---------------------------------------------- |
| Web client    | VPS, Caddy  | CI: `deploy.yml`                               |
| API + sockets | VPS, Docker | CI: `deploy.yml`                               |
| Database      | VPS, Docker | the same job                                   |
| Android       | Google Play | CI: `release.yml`                              |
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

### SEO and the web document

`apps/mobile/public/` is copied into the export as is, so everything a crawler asks for is a
plain file next to `index.html`:

| File                                 | What it is                                                                                            |
| ------------------------------------ | ----------------------------------------------------------------------------------------------------- |
| `index.html`                         | The document Expo wraps the app in — title, description, canonical, Open Graph, Twitter card, JSON-LD |
| `robots.txt`                         | Allows everything, points at the sitemap                                                              |
| `sitemap.xml`                        | One entry: the app is a single page                                                                   |
| `manifest.webmanifest`               | Installable web app — name, icons, theme                                                              |
| `llms.txt`, `llms-full.txt`          | What the game is, for models that read them                                                           |
| `og-image.png`                       | 1200×630 social preview, cut from a real screenshot                                                   |
| `icon-*.png`, `apple-touch-icon.png` | Home-screen and manifest icons                                                                        |

`web.output` is `single`, so `app/+html.tsx` would be ignored — the document is
`public/index.html` and Expo injects the bundle into it.

The absolute URLs in those files are hard-coded to `https://durakmaster.ru`. A different domain
means editing them; there is no build-time substitution.

The app ships Russian and English, but both live at the same URL — the language is a client-side
switch, not a path. So there are no per-language pages to declare with `hreflang`; the document
says `og:locale: ru_RU` with `en_US` as the alternate, and the English `llms.en.txt` sits beside
the Russian one.

The OG image is regenerated from a real screenshot rather than drawn by hand:

```bash
bun run test:e2e:shots
bunx sharp-cli -i e2e/.shots/desktop-6-table-playing.png -o apps/mobile/public/   resize 1200 630 --fit cover --position center
```

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

## Releasing to Google Play

The `release` workflow builds one App Bundle. With the `play` input on and the
`production` profile it also runs `eas submit`, which uploads that bundle to the
**internal** track as a **draft** — nothing reaches testers until you promote it
in the Console.

The store-facing paperwork — listing copy, data answers, checklists — lives in
[docs/store/](./docs/store/README.md).

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

The Data safety form, content rating and ads declaration are answered from
[docs/store/data-safety.md](./docs/store/data-safety.md); the rest of the Play
specifics are in [docs/store/google-play.md](./docs/store/google-play.md).
