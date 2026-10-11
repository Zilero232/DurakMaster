import type { Request } from 'express';

import { Controller, Get, HttpCode, HttpStatus, Req } from '@nestjs/common';

import { AppBadRequestException, AppForbiddenException } from '../../common';
import { SocketRegistryService } from '../realtime';
import { AdmobVerifierService, AdRewardsService } from './services';

const queryStringOf = (url: string): string => {
  const queryStart = url.indexOf('?');

  return queryStart === -1 ? '' : url.slice(queryStart + 1);
};

@Controller('ads')
export class AdsController {
  constructor(
    private readonly verifier: AdmobVerifierService,
    private readonly rewards: AdRewardsService,
    private readonly sockets: SocketRegistryService
  ) {}

  @Get('admob-callback')
  @HttpCode(HttpStatus.OK)
  async admobCallback(@Req() request: Request): Promise<void> {
    const query = queryStringOf(request.originalUrl);

    const signatureCheck = await this.verifier.check(query);

    if (signatureCheck === 'malformed') {
      throw new AppBadRequestException('BAD_REQUEST', 'The callback is not signed');
    }

    if (signatureCheck === 'forged') {
      throw new AppForbiddenException('FORBIDDEN', 'The callback signature does not match');
    }

    const params = new URLSearchParams(query);
    const userId = params.get('user_id');
    const transactionId = params.get('transaction_id');

    if (!userId || !transactionId) {
      return;
    }

    const outcome = await this.rewards.skipBonusWait(userId, transactionId);

    if (outcome.status === 'granted') {
      this.sockets.sendTo(userId, {
        type: 'profile:updated',
        payload: { profile: outcome.profile }
      });
    }
  }
}
