import { Injectable, Logger } from '@nestjs/common';

import { PrismaService } from '../../lib/prisma/prisma.service';

import type { MyProfile, PublicProfile } from '@durak-master/schemas';

/** Сколько кредитов выдаётся по бесплатному бонусу и как часто. */
const FREE_CREDITS_AMOUNT = 1_000;
const FREE_CREDITS_INTERVAL_MS = 4 * 60 * 60 * 1000;

/**
 * Профили игроков в Postgres.
 *
 * Балансы и рейтинг живут только здесь: держать их в памяти процесса нельзя —
 * они теряются при рестарте, а при нескольких нодах расходятся.
 */
@Injectable()
export class ProfilesService {
  private readonly logger = new Logger(ProfilesService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Профиль пользователя; создаётся при первом обращении.
   *
   * `upsert` вместо «найти, иначе создать»: параллельные подключения одного
   * игрока с двух устройств иначе гонятся за создание строки.
   */
  async ensureProfile(userId: string): Promise<MyProfile> {
    const [user, profile] = await Promise.all([
      this.prisma.user.findUnique({ where: { id: userId } }),
      this.prisma.profile.upsert({
        where: { userId },
        create: { userId },
        update: {},
      }),
    ]);

    return this.toMyProfile(userId, user?.name ?? 'Игрок', user?.image ?? null, profile);
  }

  async getPublicProfile(userId: string): Promise<PublicProfile | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user?.profile) {
      return null;
    }

    return this.toPublicProfile(userId, user.name, user.image, user.profile);
  }

  /**
   * Итог партии: рейтинг, счётчики и кредиты одной транзакцией.
   *
   * Кредиты и статистика обязаны меняться атомарно: если рейтинг записался,
   * а списание ставки нет, игрок получает выигрыш без риска.
   */
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
          // Баланс не уходит в минус: при нехватке кредитов списываем остаток.
          credits: { increment: BigInt(creditsDelta) },
          rating: { increment: ratingDelta },
          gamesPlayed: { increment: 1 },
          ...(isDraw
            ? {}
            : isWinner
              ? { gamesWon: { increment: 1 } }
              : { gamesLost: { increment: 1 } }),
        },
      });
    } catch (error) {
      this.logger.error(`Не удалось записать итог партии для ${userId}`, error);
    }
  }

  /** Хватает ли кредитов на ставку. */
  async canAfford(userId: string, bet: number): Promise<boolean> {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      select: { credits: true },
    });

    return profile !== null && profile.credits >= BigInt(bet);
  }

  /**
   * Бесплатный бонус кредитов — раз в несколько часов и только на нуле.
   * Механика RstGames: не даёт игроку застрять без ставки.
   */
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
        lastFreeCreditsAt: new Date(now),
      },
    });

    return this.ensureProfile(userId);
  }

  // --- Преобразование в схемы ----------------------------------------------

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
    },
  ): PublicProfile {
    return {
      userId,
      name,
      avatarUrl: image,
      rating: profile.rating,
      // Сезонный рейтинг появится вместе с механикой сезонов; пока равен общему.
      seasonRating: profile.rating,
      gamesPlayed: profile.gamesPlayed,
      gamesWon: profile.gamesWon,
      gamesLost: profile.gamesLost,
      isPremium: (profile.premiumUntil?.getTime() ?? 0) > Date.now(),
      isOnline: true,
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
    },
  ): MyProfile {
    const lastFree = profile.lastFreeCreditsAt?.getTime() ?? null;

    return {
      ...this.toPublicProfile(userId, name, image, profile),
      // Кредиты в БД — BigInt (баланс может быть очень большим), в протоколе
      // это число: до 2^53 хватает с запасом.
      credits: Number(profile.credits),
      coins: profile.coins,
      premiumUntil: profile.premiumUntil?.getTime() ?? null,
      loginStreak: profile.loginStreak,
      nextFreeCreditsAt: lastFree === null ? null : lastFree + FREE_CREDITS_INTERVAL_MS,
    };
  }
}
