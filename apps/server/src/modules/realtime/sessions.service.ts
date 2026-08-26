import type { MyProfile, PublicProfile } from '@durak-master/schemas';

import { Injectable } from '@nestjs/common';

import { ProfilesService } from '../profile/profiles.service';

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
  isOnline: true
});

@Injectable()
export class SessionsService {
  private readonly profiles = new Map<string, PublicProfile>();

  constructor(private readonly profilesService: ProfilesService) {}

  async load(userId: string): Promise<MyProfile> {
    const profile = await this.profilesService.ensureProfile(userId);

    this.profiles.set(userId, toPublicProfile(profile));

    return profile;
  }

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
      this.profiles.delete(userId);
    }
  }

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
