import type { MyProfile } from '@durak-master/schemas';

import { Injectable } from '@nestjs/common';
import { isNullish } from 'remeda';

import { Prisma } from '../../../../generated/prisma/client';
import { PrismaService } from '../../../lib/prisma/prisma.service';
import { FREE_CREDITS_INTERVAL_MS, ProfilesService } from '../../profile';
import { AD_SKIP_COOLDOWN_MS, AD_SKIP_WINDOW_MS, AD_SKIPS_PER_DAY } from '../config';

const WRITE_CONFLICT = 'P2034';

const UNIQUE_VIOLATION = 'P2002';

const WRITE_CONFLICT_RETRIES = 1;

const hasPrismaCode = (error: unknown, code: string): boolean =>
  error instanceof Prisma.PrismaClientKnownRequestError && error.code === code;

export type AdSkipOutcome =
  | { status: 'duplicate' }
  | { status: 'granted'; profile: MyProfile }
  | { status: 'nothing-to-skip' }
  | { status: 'on-cooldown' }
  | { status: 'over-limit' }
  | { status: 'unknown-player' };

type ClaimStatus = Exclude<AdSkipOutcome['status'], 'nothing-to-skip' | 'unknown-player'>;

@Injectable()
export class AdRewardsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly profiles: ProfilesService
  ) {}

  private async claim(userId: string, transactionId: string): Promise<ClaimStatus> {
    return this.prisma.$transaction(
      async (tx) => {
        const now = Date.now();

        const sameView = await tx.adView.findUnique({ where: { transactionId } });

        if (sameView) {
          return 'duplicate' as const;
        }

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

        await tx.adView.create({ data: { userId, transactionId } });

        await tx.profile.update({
          where: { userId },
          data: { lastFreeCreditsAt: null }
        });

        return 'granted' as const;
      },
      { isolationLevel: 'Serializable' }
    );
  }

  private async claimWithRetry(userId: string, transactionId: string): Promise<ClaimStatus> {
    let attemptsLeft = WRITE_CONFLICT_RETRIES;

    while (true) {
      try {
        return await this.claim(userId, transactionId);
      } catch (error) {
        if (hasPrismaCode(error, UNIQUE_VIOLATION)) {
          return 'duplicate';
        }

        if (!hasPrismaCode(error, WRITE_CONFLICT)) {
          throw error;
        }

        if (attemptsLeft === 0) {
          return 'on-cooldown';
        }

        attemptsLeft -= 1;
      }
    }
  }

  async skipBonusWait(userId: string, transactionId: string): Promise<AdSkipOutcome> {
    const profile = await this.prisma.profile.findUnique({ where: { userId } });

    if (!profile) {
      return { status: 'unknown-player' };
    }

    const readyAt = profile.lastFreeCreditsAt?.getTime();

    if (isNullish(readyAt) || readyAt + FREE_CREDITS_INTERVAL_MS <= Date.now()) {
      return { status: 'nothing-to-skip' };
    }

    const outcome = await this.claimWithRetry(userId, transactionId);

    if (outcome !== 'granted') {
      return { status: outcome };
    }

    return { status: 'granted', profile: await this.profiles.ensureProfile(userId) };
  }
}
