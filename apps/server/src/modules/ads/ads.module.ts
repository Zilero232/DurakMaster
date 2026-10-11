import { Module } from '@nestjs/common';

import { ProfileModule } from '../profile';
import { RealtimeModule } from '../realtime';
import { AdsController } from './ads.controller';
import { AdmobVerifierService, AdRewardsService } from './services';

@Module({
  imports: [ProfileModule, RealtimeModule],
  controllers: [AdsController],
  providers: [AdRewardsService, AdmobVerifierService]
})
export class AdsModule {}
