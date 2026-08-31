import { Module } from '@nestjs/common';

import { ProfileModule } from '../profile';
import { AdsController } from './ads.controller';
import { AdRewardsService } from './services';

@Module({
  imports: [ProfileModule],
  controllers: [AdsController],
  providers: [AdRewardsService],
  exports: [AdRewardsService]
})
export class AdsModule {}
