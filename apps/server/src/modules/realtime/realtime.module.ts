import { Module } from '@nestjs/common';

import { GameModule } from '../game/game.module';
import { ProfileModule } from '../profile';
import { SocialModule } from '../social/social.module';
import { RealtimeGateway } from './realtime.gateway';
import {
  BroadcastService,
  ConnectionService,
  FriendsPresenceService,
  GameFlowService,
  SessionsService,
  SocketRegistryService,
  TableFlowService
} from './services';

@Module({
  imports: [GameModule, ProfileModule, SocialModule],
  providers: [
    RealtimeGateway,
    SessionsService,
    SocketRegistryService,
    BroadcastService,
    ConnectionService,
    TableFlowService,
    GameFlowService,
    FriendsPresenceService
  ],
  exports: [SessionsService]
})
export class RealtimeModule {}
