import type { MyProfile, PublicProfile } from '@durak-master/schemas';

import { Injectable } from '@nestjs/common';

import type { GameResult } from '../../profile';

import { ProfilesService, toPublicProfile } from '../../profile';

const toSeatedProfile = (profile: MyProfile): PublicProfile =>
  toPublicProfile(
    { userId: profile.userId, name: profile.name, image: profile.avatarUrl },
    {
      rating: profile.rating,
      gamesPlayed: profile.gamesPlayed,
      gamesWon: profile.gamesWon,
      gamesLost: profile.gamesLost,
      premiumUntil: profile.premiumUntil === null ? null : new Date(profile.premiumUntil)
    },
    true
  );

@Injectable()
export class SessionsService {
  private readonly profiles = new Map<string, PublicProfile>();

  constructor(private readonly profilesService: ProfilesService) {}

  async load(userId: string): Promise<MyProfile> {
    const profile = await this.profilesService.ensureProfile(userId);

    this.profiles.set(userId, toSeatedProfile(profile));

    return profile;
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
      this.profiles.delete(userId);
    }
  }

  async applyGameResults(results: GameResult[]): Promise<void> {
    await this.profilesService.applyGameResults(results);

    for (const result of results) {
      this.applyToSeatedProfile(result);
    }
  }

  private applyToSeatedProfile(result: GameResult): void {
    const profile = this.profiles.get(result.userId);

    if (!profile) {
      return;
    }

    profile.rating = Math.max(0, profile.rating + result.ratingDelta);
    profile.seasonRating = Math.max(0, profile.seasonRating + result.ratingDelta);
    profile.gamesPlayed += 1;

    if (result.isDraw) {
      return;
    }

    if (result.isWinner) {
      profile.gamesWon += 1;
    } else {
      profile.gamesLost += 1;
    }
  }
}
