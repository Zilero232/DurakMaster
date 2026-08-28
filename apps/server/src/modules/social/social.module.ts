import { Module } from '@nestjs/common';

import { ProfileModule } from '../profile';
import { AchievementsService, FriendsService, LeaderboardService } from './services';

@Module({
  imports: [ProfileModule],
  providers: [AchievementsService, FriendsService, LeaderboardService],
  exports: [AchievementsService, FriendsService, LeaderboardService]
})
export class SocialModule {}
