import { Module } from '@nestjs/common';

import { ProfileModule } from '../profile/profile.module';
import { AchievementsService } from './achievements.service';
import { FriendsService } from './friends.service';
import { LeaderboardService } from './leaderboard.service';

@Module({
  imports: [ProfileModule],
  providers: [FriendsService, AchievementsService, LeaderboardService],
  exports: [FriendsService, AchievementsService, LeaderboardService]
})
export class SocialModule {}
