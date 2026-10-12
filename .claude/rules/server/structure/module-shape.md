---
paths:
  - 'apps/server/**/*.ts'
---

<!-- Compressed editing rules for the API, loaded automatically on edit. -->
<!-- The full reasoning is docs/guides/server/nestjs.md; keep them in sync. -->

# Server — module shape

NestJS 12 on Bun. A module is `x.module.ts`, an optional thin `x.controller.ts`, `services/` (one
service per domain of work), `lib/<concern>/` for pure functions and `config/` for constants, with
an `index.ts` public API. Nothing but the class in a service or controller file. Import another
module through its barrel (`from '../game'`).

`import type` is off on the server: Nest reads constructor dependencies from decorator metadata.

## Input and errors

No DTO classes: a controller takes `@Body() body: unknown` and parses it with a schema from
`@durak-master/schemas`. Throw the app exceptions from `common/exceptions` with an `ApiErrorCode` —
the body is `{ code, error }`. Expected failures inside a service are `neverthrow` `Result`s.
Authenticated routes use `@UseGuards(AuthGuard)` + `@CurrentUserId()`.

Read env through `AppConfigService`; `config/env.schema.ts` throws on boot.
