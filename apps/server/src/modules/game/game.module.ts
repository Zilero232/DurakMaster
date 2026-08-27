import { Module } from '@nestjs/common';

import { GameHistoryService, RoomsService } from './services';

@Module({
  providers: [RoomsService, GameHistoryService],
  exports: [RoomsService, GameHistoryService]
})
export class GameModule {}
