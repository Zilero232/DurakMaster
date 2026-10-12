# Data — Prisma and money writes

Part of the [style guide](../README.md).

## Schema and migrations

Prisma 7 with the `pg` driver adapter (`@prisma/adapter-pg`). `apps/server/prisma/schema.prisma`
holds the generator and the datasource; the models are split by domain in
`apps/server/prisma/models/*.prisma` (`auth`, `profile`, `game`, `table`, `social`,
`achievement`); `prisma.config.ts` points at the whole folder and reads `DIRECT_URL` from the root
`.env`. The generated client goes to `apps/server/generated/prisma` (gitignored, ESLint- and
Prettier-ignored) and is regenerated on `bun install` (`postinstall`).

```bash
bun --filter @durak-master/server db:migrate   # create + apply a migration, regenerate
bun --filter @durak-master/server db:reset     # drop the dev database and re-apply everything
bun --filter @durak-master/server db:studio
```

A schema change ships with its migration in the same commit — `migrate deploy` in production only
applies what is committed ([deploy](../../ops/deploy.md#migrations)). The migrations were squashed
into one `20261011000000_init`; new ones go on top of it.

**`auth.prisma` belongs to better-auth.** The `user`, `session`, `account` and `verification`
models must match what the pinned better-auth version writes, column for column. A column it no
longer fills but the schema still requires fails every insert — see
[`docs/architecture/auth.md`](../../architecture/auth.md).

## Money writes are conditional

Credits and coins change only through a single conditional `updateMany` — the balance check and
the change are one statement, so two concurrent requests cannot both spend the same balance:

```ts
const held = await this.prisma.profile.updateMany({
  where: { userId, credits: { gte: BigInt(bet) } },
  data: { credits: { decrement: BigInt(bet) } }
});

return held.count > 0;
```

Never read a balance, compare in TypeScript and write it back. A settlement that touches several
players is one `$transaction`; a claim that must be unique per external id (an AdMob
`transaction_id`) is a unique column plus a `Serializable` transaction that maps `P2002` to
"duplicate". Who may hold or release a stake is [`docs/architecture/stakes.md`](../../architecture/stakes.md).

## Prisma in services

`PrismaService` (in `lib/prisma`) extends the generated client and is injected like any provider.
A service owns its queries; a controller never touches Prisma. Credits are `BigInt` in the
database and `number` in `MyProfile` — convert at the edge (`Number(profile.credits)`), not in the
middle of the logic.
