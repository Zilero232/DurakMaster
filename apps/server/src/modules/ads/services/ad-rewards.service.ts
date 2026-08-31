import type { MyProfile } from '@durak-master/schemas';

import { Injectable } from '@nestjs/common';
import { isNullish } from 'remeda';

import { Prisma } from '../../../../generated/prisma/client';
import { PrismaService } from '../../../lib/prisma/prisma.service';
import { FREE_CREDITS_INTERVAL_MS, ProfilesService } from '../../profile';
import { AD_SKIP_COOLDOWN_MS, AD_SKIP_WINDOW_MS, AD_SKIPS_PER_DAY } from '../config';

const WRITE_CONFLICT = 'P2034';

const WRITE_CONFLICT_RETRIES = 1;

const isWriteConflict = (error: unknown): boolean =>
  error instanceof Prisma.PrismaClientKnownRequestError && error.code === WRITE_CONFLICT;

export type AdSkipOutcome =
  | { status: 'granted'; profile: MyProfile }
  | { status: 'nothing-to-skip' }
  | { status: 'on-cooldown' }
  | { status: 'over-limit' }
  | { status: 'unknown-player' };

@Injectable()
export class AdRewardsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly profiles: ProfilesService
  ) {}

  private async claim(userId: string): Promise<Exclude<AdSkipOutcome['status'], 'unknown-player'>> {
    return this.prisma.$transaction(
      async (tx) => {
        const now = Date.now();

        const lastView = await tx.adView.findFirst({
          where: { userId },
          orderBy: { createdAt: 'desc' }
        });

        if (lastView && now - lastView.createdAt.getTime() < AD_SKIP_COOLDOWN_MS) {
          return 'on-cooldown' as const;
        }

        const viewedToday = await tx.adView.count({
          where: { userId, createdAt: { gte: new Date(now - AD_SKIP_WINDOW_MS) } }
        });

        if (viewedToday >= AD_SKIPS_PER_DAY) {
          return 'over-limit' as const;
        }

        await tx.adView.create({ data: { userId } });

        await tx.profile.update({
          where: { userId },
          data: { lastFreeCreditsAt: null }
        });

        return 'granted' as const;
      },
      { isolationLevel: 'Serializable' }
    );
  }

  private async claimWithRetry(
    userId: string
  ): Promise<Exclude<AdSkipOutcome['status'], 'unknown-player'>> {
    let attemptsLeft = WRITE_CONFLICT_RETRIES;

    while (true) {
      try {
        return await this.claim(userId);
      } catch (error) {
        if (!isWriteConflict(error)) {
          throw error;
        }

        if (attemptsLeft === 0) {
          return 'on-cooldown';
        }

        attemptsLeft -= 1;
      }
    }
  }

  async skipBonusWait(userId: string): Promise<AdSkipOutcome> {
    const profile = await this.prisma.profile.findUnique({ where: { userId } });

    if (!profile) {
      return { status: 'unknown-player' };
    }

    const readyAt = profile.lastFreeCreditsAt?.getTime();

    if (isNullish(readyAt) || readyAt + FREE_CREDITS_INTERVAL_MS <= Date.now()) {
      return { status: 'nothing-to-skip' };
    }

    const outcome = await this.claimWithRetry(userId);

    if (outcome !== 'granted') {
      return { status: outcome };
    }

    return { status: 'granted', profile: await this.profiles.ensureProfile(userId) };
  }
}
