import { Injectable } from '@nestjs/common';

import { ProfilesService } from '../profile/profiles.service';

import type { MyProfile, PublicProfile } from '@durak-master/schemas';

/** Публичная часть профиля: без балансов, их видит только владелец. */
const toPublicProfile = (profile: MyProfile): PublicProfile => ({
  userId: profile.userId,
  name: profile.name,
  avatarUrl: profile.avatarUrl,
  rating: profile.rating,
  seasonRating: profile.seasonRating,
  gamesPlayed: profile.gamesPlayed,
  gamesWon: profile.gamesWon,
  gamesLost: profile.gamesLost,
  isPremium: profile.isPremium,
  isOnline: true,
});

/**
 * Профили подключённых игроков.
 *
 * Источник истины — Postgres (`ProfilesService`); здесь только кеш на время
 * жизни соединения, чтобы каждая рассылка состояния не ходила в БД.
 *
 * Личность игрока НИКОГДА не берётся из клиентских данных: `userId` приходит
 * из проверенной сессии better-auth, иначе можно было бы играть от чужого имени.
 */
@Injectable()
export class SessionsService {
  private readonly profiles = new Map<string, PublicProfile>();

  constructor(private readonly profilesService: ProfilesService) {}

  /**
   * Поднимает профиль из БД и кладёт в кеш.
   *
   * Возвращает ПОЛНЫЙ профиль с балансами — он уходит только владельцу
   * соединения. В кеш при этом ложится публичная часть: её видят соседи
   * по столу, и кредиты туда попадать не должны.
   */
  async load(userId: string): Promise<MyProfile> {
    const profile = await this.profilesService.ensureProfile(userId);

    this.profiles.set(userId, toPublicProfile(profile));

    return profile;
  }

  /** Свежий профиль владельца — после партии, бонуса или покупки. */
  async reload(userId: string): Promise<MyProfile> {
    return this.load(userId);
  }

  get(userId: string): PublicProfile | undefined {
    return this.profiles.get(userId);
  }

  setOnline(userId: string, isOnline: boolean): void {
    const profile = this.profiles.get(userId);

    if (profile) {
      profile.isOnline = isOnline;
    }

    if (!isOnline) {
      // Кеш живёт только на время соединения: при следующем подключении
      // профиль поднимется из БД со свежими балансом и рейтингом.
      this.profiles.delete(userId);
    }
  }

  /**
   * Итог партии: пишется в БД, кеш обновляется следом.
   * Порядок важен — в кеше не должно оказаться значений, которых нет в БД.
   */
  async applyGameResult(input: {
    userId: string;
    creditsDelta: number;
    ratingDelta: number;
    isWinner: boolean;
    isDraw: boolean;
  }): Promise<void> {
    await this.profilesService.applyGameResult(input);

    const profile = this.profiles.get(input.userId);

    if (!profile) {
      return;
    }

    profile.rating = Math.max(0, profile.rating + input.ratingDelta);
    profile.seasonRating = Math.max(0, profile.seasonRating + input.ratingDelta);
    profile.gamesPlayed += 1;

    if (input.isDraw) {
      return;
    }

    if (input.isWinner) {
      profile.gamesWon += 1;
    } else {
      profile.gamesLost += 1;
    }
  }
}
