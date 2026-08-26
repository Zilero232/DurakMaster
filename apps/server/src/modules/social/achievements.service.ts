import type { AchievementId, AchievementState } from '@durak-master/schemas';

import { ACHIEVEMENTS, getAchievement } from '@durak-master/schemas';
import { Injectable, Logger } from '@nestjs/common';

import { PrismaService } from '../../lib/prisma/prisma.service';

export type GameOutcomeFacts = {
  isWin: boolean;

  isFlawless: boolean;

  endedOnTrumps: boolean;
  game: string;
};

export type ClaimResult = { coins: number } | { error: 'ALREADY_CLAIMED' | 'NOT_UNLOCKED' };

const ALREADY_CLAIMED = Symbol('ALREADY_CLAIMED');

@Injectable()
export class AchievementsService {
  private readonly logger = new Logger(AchievementsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async list(userId: string): Promise<AchievementState[]> {
    const rows = await this.prisma.achievementProgress.findMany({ where: { userId } });
    const byId = new Map(rows.map((row) => [row.achievementId, row]));

    return ACHIEVEMENTS.map((entry) => {
      const row = byId.get(entry.id);

      return {
        id: entry.id,
        progress: Math.min(row?.progress ?? 0, entry.target),
        target: entry.target,
        reward: entry.reward,
        unlockedAt: row?.unlockedAt?.getTime() ?? null,
        claimedAt: row?.claimedAt?.getTime() ?? null
      };
    });
  }

  async recordGame(userId: string, facts: GameOutcomeFacts): Promise<AchievementId[]> {
    const unlocked: AchievementId[] = [];

    const bump = async (id: AchievementId, by = 1) => {
      if (await this.increment(userId, id, by)) {
        unlocked.push(id);
      }
    };

    await bump('firstGame');
    await bump('tenGames');
    await bump('hundredGames');
    await bump('thousandGames');

    if (facts.isWin) {
      await bump('firstWin');
      await bump('tenWins');
      await bump('hundredWins');
    }

    await this.applyWinStreak(userId, facts.isWin, unlocked);

    if (facts.isFlawless && facts.isWin) {
      await bump('flawless');
    }

    if (facts.endedOnTrumps && facts.isWin) {
      await bump('allTrumps');
    }

    return unlocked;
  }

  async recordLoginStreak(userId: string, streak: number): Promise<AchievementId[]> {
    const unlocked: AchievementId[] = [];

    for (const id of ['loginStreak7', 'loginStreak30'] as const) {
      if (await this.setProgress(userId, id, streak)) {
        unlocked.push(id);
      }
    }

    return unlocked;
  }

  async recordFriend(userId: string): Promise<AchievementId[]> {
    return (await this.increment(userId, 'firstFriend', 1)) ? ['firstFriend'] : [];
  }

  async claim(userId: string, id: AchievementId): Promise<ClaimResult> {
    const entry = getAchievement(id);

    if (!entry) {
      return { error: 'NOT_UNLOCKED' };
    }

    const row = await this.prisma.achievementProgress.findUnique({
      where: { userId_achievementId: { userId, achievementId: id } }
    });

    if (!row?.unlockedAt) {
      return { error: 'NOT_UNLOCKED' };
    }

    if (row.claimedAt) {
      return { error: 'ALREADY_CLAIMED' };
    }

    try {
      await this.prisma.$transaction(async (tx) => {
        const claimed = await tx.achievementProgress.updateMany({
          where: { id: row.id, claimedAt: null },
          data: { claimedAt: new Date() }
        });

        if (claimed.count === 0) {
          throw ALREADY_CLAIMED;
        }

        await tx.profile.update({
          where: { userId },
          data: { coins: { increment: entry.reward } }
        });
      });
    } catch (error) {
      if (error === ALREADY_CLAIMED) {
        return { error: 'ALREADY_CLAIMED' };
      }

      this.logger.error(`Failed to pay out ${id} for ${userId}`, error);

      return { error: 'NOT_UNLOCKED' };
    }

    return { coins: entry.reward };
  }

  private async increment(userId: string, id: AchievementId, by: number): Promise<boolean> {
    const entry = getAchievement(id);

    if (!entry) {
      return false;
    }

    const row = await this.prisma.achievementProgress.upsert({
      where: { userId_achievementId: { userId, achievementId: id } },
      create: { userId, achievementId: id, progress: by },
      update: { progress: { increment: by } }
    });

    return this.unlockIfReached(row.id, row.progress, entry.target, row.unlockedAt);
  }

  private async setProgress(userId: string, id: AchievementId, value: number): Promise<boolean> {
    const entry = getAchievement(id);

    if (!entry) {
      return false;
    }

    const row = await this.prisma.achievementProgress.upsert({
      where: { userId_achievementId: { userId, achievementId: id } },
      create: { userId, achievementId: id, progress: value },
      update: { progress: value }
    });

    return this.unlockIfReached(row.id, value, entry.target, row.unlockedAt);
  }

  private async unlockIfReached(
    rowId: string,
    progress: number,
    target: number,
    unlockedAt: Date | null
  ): Promise<boolean> {
    if (unlockedAt || progress < target) {
      return false;
    }

    await this.prisma.achievementProgress.update({
      where: { id: rowId },
      data: { unlockedAt: new Date() }
    });

    return true;
  }

  private async applyWinStreak(
    userId: string,
    isWin: boolean,
    unlocked: AchievementId[]
  ): Promise<void> {
    await this.prisma.profile.updateMany({
      where: { userId },
      data: isWin ? { winStreak: { increment: 1 } } : { winStreak: 0 }
    });

    if (!isWin) {
      return;
    }

    const profile = await this.prisma.profile.findUnique({ where: { userId } });

    if (!profile) {
      return;
    }

    for (const id of ['winStreak3', 'winStreak5', 'winStreak10'] as const) {
      if (await this.setProgress(userId, id, profile.winStreak)) {
        unlocked.push(id);
      }
    }
  }
}
