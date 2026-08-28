import type { AvatarSeed, MyProfile, PublicProfile } from '@durak-master/schemas';

import { toAvatarUrl } from '@durak-master/schemas';
import { Injectable, Logger } from '@nestjs/common';

import { PrismaService } from '../../../lib/prisma/prisma.service';

const FREE_CREDITS_AMOUNT = 1_000;
const FREE_CREDITS_INTERVAL_MS = 4 * 60 * 60 * 1000;

@Injectable()
export class ProfilesService {
  private readonly logger = new Logger(ProfilesService.name);

  constructor(private readonly prisma: PrismaService) {}

  async ensureProfile(userId: string): Promise<MyProfile> {
    const [user, profile] = await Promise.all([
      this.prisma.user.findUnique({ where: { id: userId } }),
      this.prisma.profile.upsert({
        where: { userId },
        create: { userId },
        update: {}
      })
    ]);

    return this.toMyProfile(userId, user?.name ?? 'Player', user?.image ?? null, profile);
  }

  async getPublicProfile(userId: string): Promise<PublicProfile | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true }
    });

    if (!user?.profile) {
      return null;
    }

    return this.toPublicProfile(userId, user.name, user.image, user.profile);
  }

  async getPublicProfiles(userIds: string[]): Promise<Map<string, PublicProfile>> {
    if (userIds.length === 0) {
      return new Map();
    }

    const users = await this.prisma.user.findMany({
      where: { id: { in: userIds } },
      include: { profile: true }
    });

    return new Map(
      users.map((user) => [
        user.id,
        this.toPublicProfile(
          user.id,
          user.name,
          user.image,
          user.profile ?? {
            rating: 0,
            gamesPlayed: 0,
            gamesWon: 0,
            gamesLost: 0,
            premiumUntil: null
          }
        )
      ])
    );
  }

  async spendCoins(userId: string, amount: number): Promise<number | null> {
    const updated = await this.prisma.profile.updateMany({
      where: { userId, coins: { gte: amount } },
      data: { coins: { decrement: amount } }
    });

    if (updated.count === 0) {
      return null;
    }

    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      select: { coins: true }
    });

    return profile?.coins ?? null;
  }

  async applyGameResult(input: {
    userId: string;
    creditsDelta: number;
    ratingDelta: number;
    isWinner: boolean;
    isDraw: boolean;
  }): Promise<void> {
    const { userId, creditsDelta, ratingDelta, isWinner, isDraw } = input;

    try {
      await this.prisma.profile.update({
        where: { userId },
        data: {
          credits: { increment: BigInt(creditsDelta) },
          rating: { increment: ratingDelta },
          gamesPlayed: { increment: 1 },
          ...(isDraw
            ? {}
            : isWinner
              ? { gamesWon: { increment: 1 } }
              : { gamesLost: { increment: 1 } })
        }
      });
    } catch (error) {
      this.logger.error(`Failed to record the game result for ${userId}`, error);
    }
  }

  async reserveStake(userId: string, bet: number): Promise<boolean> {
    if (bet <= 0) {
      return true;
    }

    const held = await this.prisma.profile.updateMany({
      where: { userId, credits: { gte: BigInt(bet) } },
      data: { credits: { decrement: BigInt(bet) } }
    });

    return held.count > 0;
  }

  async releaseStake(userId: string, bet: number): Promise<void> {
    if (bet <= 0) {
      return;
    }

    await this.prisma.profile.updateMany({
      where: { userId },
      data: { credits: { increment: BigInt(bet) } }
    });
  }

  async canAfford(userId: string, bet: number): Promise<boolean> {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      select: { credits: true }
    });

    return profile !== null && profile.credits >= BigInt(bet);
  }

  async claimFreeCredits(userId: string): Promise<MyProfile | null> {
    const profile = await this.prisma.profile.findUnique({ where: { userId } });

    if (!profile) {
      return null;
    }

    const now = Date.now();
    const last = profile.lastFreeCreditsAt?.getTime() ?? 0;

    if (now - last < FREE_CREDITS_INTERVAL_MS) {
      return null;
    }

    await this.prisma.profile.update({
      where: { userId },
      data: {
        credits: { increment: BigInt(FREE_CREDITS_AMOUNT) },
        lastFreeCreditsAt: new Date(now)
      }
    });

    return this.ensureProfile(userId);
  }

  async setAvatar(userId: string, seed: AvatarSeed): Promise<MyProfile> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { image: toAvatarUrl(seed) }
    });

    return this.ensureProfile(userId);
  }

  async setAvatarUrl(userId: string, url: string): Promise<MyProfile> {
    await this.prisma.user.update({ where: { id: userId }, data: { image: url } });

    return this.ensureProfile(userId);
  }

  async setName(userId: string, name: string): Promise<MyProfile> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { name: name.trim() }
    });

    return this.ensureProfile(userId);
  }

  async recordLogin(userId: string): Promise<number> {
    const profile = await this.prisma.profile.findUnique({ where: { userId } });

    if (!profile) {
      return 0;
    }

    const now = new Date();
    const today = this.dayNumber(now);
    const last = profile.lastLoginAt ? this.dayNumber(profile.lastLoginAt) : null;

    if (last === today) {
      return profile.loginStreak;
    }

    const loginStreak = last !== null && today - last === 1 ? profile.loginStreak + 1 : 1;

    await this.prisma.profile.update({
      where: { userId },
      data: { loginStreak, lastLoginAt: now }
    });

    return loginStreak;
  }

  private dayNumber(date: Date): number {
    return Math.floor(date.getTime() / (24 * 60 * 60 * 1000));
  }

  private toPublicProfile(
    userId: string,
    name: string,
    image: string | null,
    profile: {
      rating: number;
      gamesPlayed: number;
      gamesWon: number;
      gamesLost: number;
      premiumUntil: Date | null;
    }
  ): PublicProfile {
    return {
      userId,
      name,
      avatarUrl: image,
      rating: profile.rating,
      seasonRating: profile.rating,
      gamesPlayed: profile.gamesPlayed,
      gamesWon: profile.gamesWon,
      gamesLost: profile.gamesLost,
      isPremium: (profile.premiumUntil?.getTime() ?? 0) > Date.now(),
      isOnline: true
    };
  }

  private toMyProfile(
    userId: string,
    name: string,
    image: string | null,
    profile: {
      rating: number;
      gamesPlayed: number;
      gamesWon: number;
      gamesLost: number;
      premiumUntil: Date | null;
      credits: bigint;
      coins: number;
      loginStreak: number;
      lastFreeCreditsAt: Date | null;
    }
  ): MyProfile {
    const lastFree = profile.lastFreeCreditsAt?.getTime() ?? null;

    return {
      ...this.toPublicProfile(userId, name, image, profile),
      credits: Number(profile.credits),
      coins: profile.coins,
      premiumUntil: profile.premiumUntil?.getTime() ?? null,
      loginStreak: profile.loginStreak,
      nextFreeCreditsAt: lastFree === null ? null : lastFree + FREE_CREDITS_INTERVAL_MS
    };
  }
}
