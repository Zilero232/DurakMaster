import { Module } from '@nestjs/common';

import { GameModule } from '../game/game.module';
import { ProfileModule } from '../profile';
import {
  AchievementsService,
  FriendsService,
  LeaderboardService,
  OnlinePlayersService,
  TableInvitesService
} from './services';
import { SocialController } from './social.controller';

@Module({
  imports: [GameModule, ProfileModule],
  controllers: [SocialController],
  providers: [
    AchievementsService,
    FriendsService,
    LeaderboardService,
    OnlinePlayersService,
    TableInvitesService
  ],
  exports: [AchievementsService, FriendsService, OnlinePlayersService, TableInvitesService]
})
export class SocialModule {}
