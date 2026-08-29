import { Module } from '@nestjs/common';

import { ProfileModule } from '../profile';
import { AchievementsService, FriendsService, LeaderboardService } from './services';
import { SocialController } from './social.controller';

@Module({
  imports: [ProfileModule],
  controllers: [SocialController],
  providers: [AchievementsService, FriendsService, LeaderboardService],
  exports: [AchievementsService, FriendsService, LeaderboardService]
})
export class SocialModule {}
