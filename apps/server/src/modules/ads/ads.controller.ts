import type { MyProfile } from '@durak-master/schemas';

import { Controller, Post, UseGuards } from '@nestjs/common';
import { match } from 'ts-pattern';

import { AppBadRequestException, AuthGuard, CurrentUserId } from '../../common';
import { AdRewardsService } from './services';

@Controller('ads')
@UseGuards(AuthGuard)
export class AdsController {
  constructor(private readonly rewards: AdRewardsService) {}

  @Post('skip-bonus-wait')
  async skipBonusWait(@CurrentUserId() userId: string): Promise<MyProfile> {
    const outcome = await this.rewards.skipBonusWait(userId);

    return match(outcome)
      .with({ status: 'granted' }, ({ profile }) => profile)
      .otherwise(({ status }) => {
        throw new AppBadRequestException('BAD_REQUEST', `Ad reward refused: ${status}`);
      });
  }
}
