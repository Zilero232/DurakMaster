import { Module } from '@nestjs/common';

import { GameModule } from '../game/game.module';
import { ProfileModule } from '../profile/profile.module';
import { SocialModule } from '../social/social.module';
import { RealtimeGateway } from './realtime.gateway';
import { SessionsService } from './sessions.service';

@Module({
  imports: [GameModule, ProfileModule, SocialModule],
  providers: [RealtimeGateway, SessionsService],
  exports: [SessionsService]
})
export class RealtimeModule {}
