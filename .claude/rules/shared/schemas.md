---
paths:
  - 'packages/schemas/**/*.ts'
  - 'apps/mobile/**/*.{ts,tsx}'
  - 'apps/server/**/*.ts'
---

<!-- Compressed editing rules, loaded automatically when a TS/JS file is edited. -->
<!-- The full reasoning is docs/guides/shared/schemas.md; keep them in sync. -->

# Shared schemas

Every contract shared by the client and the server is a Zod schema in `packages/schemas`
(`@durak-master/schemas`), one folder per domain; the package imports only `zod`. A new socket
message is added to `clientMessageSchema` / `serverMessageSchema` first. `z.input` types form
defaults, `z.output` what is sent. `@/shared/api` exports runtime clients, never domain types.
