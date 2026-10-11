import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Prisma } from '../../../../../generated/prisma/client';
import { AD_SKIP_COOLDOWN_MS, AD_SKIP_WINDOW_MS, AD_SKIPS_PER_DAY } from '../../config';
import { AdRewardsService } from '../ad-rewards.service';

const USER_ID = 'player-1';

const TRANSACTION_ID = 'admob-transaction-1';

const WAITING = new Date();

const createPrisma = (
  views: Date[] = [],
  { hasProfile = true, lastFreeCreditsAt = WAITING as Date | null } = {}
) => {
  const rows = views.map((createdAt, index) => ({ createdAt, transactionId: `earlier-${index}` }));

  const client = {
    profile: {
      findUnique: vi.fn(async () => (hasProfile ? { userId: USER_ID, lastFreeCreditsAt } : null)),
      update: vi.fn(async () => ({}))
    },

    adView: {
      findUnique: vi.fn(
        async ({ where }: { where: { transactionId: string } }) =>
          rows.find((row) => row.transactionId === where.transactionId) ?? null
      ),

      findFirst: vi.fn(async () => {
        const latest = [...rows].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];

        return latest ?? null;
      }),

      count: vi.fn(
        async ({ where }: { where: { createdAt: { gte: Date } } }) =>
          rows.filter((row) => row.createdAt >= where.createdAt.gte).length
      ),

      create: vi.fn(async ({ data }: { data: { transactionId: string } }) => {
        rows.push({ createdAt: new Date(), transactionId: data.transactionId });

        return {};
      })
    },

    $transaction: vi.fn(async (run: (tx: unknown) => Promise<unknown>) => await run(client))
  };

  return { client, rows };
};

const createService = (prisma: ReturnType<typeof createPrisma>['client']) =>
  new AdRewardsService(
    prisma as never,
    {
      ensureProfile: vi.fn(async () => ({ userId: USER_ID }))
    } as never
  );

const agoMs = (ms: number): Date => new Date(Date.now() - ms);

describe('ad reward limits', () => {
  let prisma: ReturnType<typeof createPrisma>;

  beforeEach(() => {
    prisma = createPrisma();
  });

  it('checks the limits under a serializable transaction', async () => {
    await createService(prisma.client).skipBonusWait(USER_ID, TRANSACTION_ID);

    expect(prisma.client.$transaction).toHaveBeenCalledWith(expect.any(Function), {
      isolationLevel: 'Serializable'
    });
  });

  it('clears the bonus wait on the first view of the day', async () => {
    const result = await createService(prisma.client).skipBonusWait(USER_ID, TRANSACTION_ID);

    expect(result.status).toBe('granted');
    expect(prisma.client.profile.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: { lastFreeCreditsAt: null } })
    );
  });

  it('refuses a second view inside the cooldown', async () => {
    const recent = createPrisma([agoMs(AD_SKIP_COOLDOWN_MS - 1_000)]);

    const result = await createService(recent.client).skipBonusWait(USER_ID, TRANSACTION_ID);

    expect(result.status).toBe('on-cooldown');
    expect(recent.client.adView.create).not.toHaveBeenCalled();
  });

  it('allows a view once the cooldown has passed', async () => {
    const settled = createPrisma([agoMs(AD_SKIP_COOLDOWN_MS + 1_000)]);

    const result = await createService(settled.client).skipBonusWait(USER_ID, TRANSACTION_ID);

    expect(result.status).toBe('granted');
  });

  it('refuses once the daily cap is reached', async () => {
    const spent = createPrisma(
      Array.from({ length: AD_SKIPS_PER_DAY }, () => agoMs(AD_SKIP_COOLDOWN_MS + 1_000))
    );

    const result = await createService(spent.client).skipBonusWait(USER_ID, TRANSACTION_ID);

    expect(result.status).toBe('over-limit');
    expect(spent.client.profile.update).not.toHaveBeenCalled();
  });

  it('ignores views that fell out of the window', async () => {
    const old = createPrisma(
      Array.from({ length: AD_SKIPS_PER_DAY }, () => agoMs(AD_SKIP_WINDOW_MS + 60_000))
    );

    const result = await createService(old.client).skipBonusWait(USER_ID, TRANSACTION_ID);

    expect(result.status).toBe('granted');
  });

  it('refuses when the bonus is already waiting to be claimed', async () => {
    const ready = createPrisma([], { lastFreeCreditsAt: null });

    const result = await createService(ready.client).skipBonusWait(USER_ID, TRANSACTION_ID);

    expect(result.status).toBe('nothing-to-skip');
    expect(ready.client.$transaction).not.toHaveBeenCalled();
  });

  it('retries once when the write conflicts, then gives up', async () => {
    const conflicted = createPrisma();

    conflicted.client.$transaction = vi.fn(async () => {
      throw new Prisma.PrismaClientKnownRequestError('write conflict', {
        code: 'P2034',
        clientVersion: 'test'
      });
    });

    const result = await createService(conflicted.client).skipBonusWait(USER_ID, TRANSACTION_ID);

    expect(result.status).toBe('on-cooldown');
    expect(conflicted.client.$transaction).toHaveBeenCalledTimes(2);
  });

  it('treats a concurrent insert of the same transaction as a duplicate', async () => {
    const raced = createPrisma();

    raced.client.$transaction = vi.fn(async () => {
      throw new Prisma.PrismaClientKnownRequestError('unique violation', {
        code: 'P2002',
        clientVersion: 'test'
      });
    });

    const result = await createService(raced.client).skipBonusWait(USER_ID, TRANSACTION_ID);

    expect(result.status).toBe('duplicate');
  });

  it('lets an unrelated database error through', async () => {
    const broken = createPrisma();

    broken.client.$transaction = vi.fn(async () => {
      throw new Error('the database went away');
    });

    await expect(
      createService(broken.client).skipBonusWait(USER_ID, TRANSACTION_ID)
    ).rejects.toThrow('the database went away');
  });

  it('refuses a player who has no profile', async () => {
    const stranger = createPrisma([], { hasProfile: false });

    const result = await createService(stranger.client).skipBonusWait(USER_ID, TRANSACTION_ID);

    expect(result.status).toBe('unknown-player');
  });
});

describe('ad reward idempotency', () => {
  it('grants a transaction once, however often AdMob delivers it', async () => {
    const prisma = createPrisma();
    const service = createService(prisma.client);

    const first = await service.skipBonusWait(USER_ID, TRANSACTION_ID);
    const repeat = await service.skipBonusWait(USER_ID, TRANSACTION_ID);

    expect(first.status).toBe('granted');
    expect(repeat.status).toBe('duplicate');
    expect(prisma.client.adView.create).toHaveBeenCalledTimes(1);
    expect(prisma.client.profile.update).toHaveBeenCalledTimes(1);
  });

  it('stores the transaction id with the view', async () => {
    const prisma = createPrisma();

    await createService(prisma.client).skipBonusWait(USER_ID, TRANSACTION_ID);

    expect(prisma.client.adView.create).toHaveBeenCalledWith({
      data: { userId: USER_ID, transactionId: TRANSACTION_ID }
    });
  });

  it('reports a repeated transaction as a duplicate, not a cooldown', async () => {
    const prisma = createPrisma();
    const service = createService(prisma.client);

    await service.skipBonusWait(USER_ID, TRANSACTION_ID);

    const repeat = await service.skipBonusWait(USER_ID, TRANSACTION_ID);
    const another = await service.skipBonusWait(USER_ID, 'admob-transaction-2');

    expect(repeat.status).toBe('duplicate');
    expect(another.status).toBe('on-cooldown');
  });
});
