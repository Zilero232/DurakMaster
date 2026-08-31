import { describe, expect, it, vi } from 'vitest';

import { FREE_CREDITS_INTERVAL_MS } from '../../config';
import { ProfilesService } from '../profiles.service';

const USER_ID = 'player-1';

type Row = { coins: number; credits: bigint; lastFreeCreditsAt: Date | null };

const createPrisma = (row: Row) => {
  const state = { ...row };

  const matches = (where: Record<string, unknown>): boolean => {
    const coins = where.coins as { gte: number } | undefined;

    if (coins && state.coins < coins.gte) {
      return false;
    }

    const credits = where.credits as { gte: bigint } | undefined;

    if (credits && state.credits < credits.gte) {
      return false;
    }

    const ready = where.OR as { lastFreeCreditsAt: unknown }[] | undefined;

    if (ready) {
      const at = state.lastFreeCreditsAt;
      const before = (ready[1]?.lastFreeCreditsAt as { lte: Date } | undefined)?.lte;

      return at === null || (before !== undefined && at <= before);
    }

    return true;
  };

  const client = {
    profile: {
      updateMany: vi.fn(
        async ({
          where,
          data
        }: {
          where: Record<string, unknown>;
          data: Record<string, never>;
        }) => {
          if (!matches(where)) {
            return { count: 0 };
          }

          const coins = data.coins as { decrement?: number } | undefined;
          const credits = data.credits as { increment?: number } | undefined;

          if (coins?.decrement) {
            state.coins -= coins.decrement;
          }

          if (credits?.increment) {
            state.credits += BigInt(credits.increment);
          }

          if ('lastFreeCreditsAt' in data) {
            state.lastFreeCreditsAt = data.lastFreeCreditsAt as unknown as Date;
          }

          return { count: 1 };
        }
      ),

      findUnique: vi.fn(async () => ({ ...state }))
    }
  };

  return { client, state };
};

const createService = (client: ReturnType<typeof createPrisma>['client']) => {
  const service = new ProfilesService(client as never);

  vi.spyOn(service, 'ensureProfile').mockResolvedValue({ userId: USER_ID } as never);

  return service;
};

const readyRow = (): Row => ({ coins: 15, credits: 1_000n, lastFreeCreditsAt: null });

describe('spending coins', () => {
  it('refuses to overdraw and leaves the balance alone', async () => {
    const prisma = createPrisma({ ...readyRow(), coins: 3 });

    expect(await createService(prisma.client).spendCoins(USER_ID, 10)).toBeNull();
    expect(prisma.state.coins).toBe(3);
  });

  it('spends what the player can afford', async () => {
    const prisma = createPrisma({ ...readyRow(), coins: 15 });

    expect(await createService(prisma.client).spendCoins(USER_ID, 10)).toBe(5);
  });
});

describe('reserving a stake', () => {
  it('refuses a bet the player cannot cover', async () => {
    const prisma = createPrisma({ ...readyRow(), credits: 100n });

    expect(await createService(prisma.client).reserveStake(USER_ID, 500)).toBe(false);
    expect(prisma.state.credits).toBe(100n);
  });

  it('lets a free bet through without touching the balance', async () => {
    const prisma = createPrisma(readyRow());

    expect(await createService(prisma.client).reserveStake(USER_ID, 0)).toBe(true);
    expect(prisma.client.profile.updateMany).not.toHaveBeenCalled();
  });
});

describe('claiming the free bonus', () => {
  it('pays out when the timer has never run', async () => {
    const prisma = createPrisma(readyRow());

    expect(await createService(prisma.client).claimFreeCredits(USER_ID)).not.toBeNull();
    expect(prisma.state.credits).toBeGreaterThan(1_000n);
  });

  it('refuses while the wait is still on', async () => {
    const prisma = createPrisma({ ...readyRow(), lastFreeCreditsAt: new Date() });

    expect(await createService(prisma.client).claimFreeCredits(USER_ID)).toBeNull();
    expect(prisma.state.credits).toBe(1_000n);
  });

  it('pays out exactly on the boundary', async () => {
    const prisma = createPrisma({
      ...readyRow(),
      lastFreeCreditsAt: new Date(Date.now() - FREE_CREDITS_INTERVAL_MS)
    });

    expect(await createService(prisma.client).claimFreeCredits(USER_ID)).not.toBeNull();
  });

  it('pays out once the wait has passed', async () => {
    const prisma = createPrisma({
      ...readyRow(),
      lastFreeCreditsAt: new Date(Date.now() - FREE_CREDITS_INTERVAL_MS - 1_000)
    });

    expect(await createService(prisma.client).claimFreeCredits(USER_ID)).not.toBeNull();
    expect(prisma.state.credits).toBeGreaterThan(1_000n);
  });
});
