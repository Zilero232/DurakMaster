import { Module } from '@nestjs/common';

import { GameHistoryService } from './game-history.service';
import { RoomsService } from './rooms.service';

@Module({
  providers: [RoomsService, GameHistoryService],
  exports: [RoomsService, GameHistoryService]
})
export class GameModule {}
