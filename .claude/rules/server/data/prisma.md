---
paths:
  - 'apps/server/prisma/**/*.prisma'
  - 'apps/server/prisma.config.ts'
  - 'apps/server/src/lib/auth/**/*.ts'
---

<!-- Compressed editing rules for the API, loaded automatically on edit. -->
<!-- The full reasoning is docs/guides/server/data.md and docs/architecture/auth.md; keep them in sync. -->

# Server — Prisma and the auth schema

- Models are split in `prisma/models/*.prisma`; a schema change ships with its migration
  (`bun --filter @durak-master/server db:migrate`) in the same commit.
- `auth.prisma` belongs to better-auth: its models must match what the pinned version writes. After
  a better-auth bump, compare with the release's `get-tables` schema and sign up against a running
  API (the `curl` in the root `CLAUDE.md`) — `bun verify` does not catch it.
- `better-auth` and `@better-auth/expo` stay on one exact version in both apps.
- `trustedOrigins`: `durakmaster://` in production, plus `exp://**` in development.
