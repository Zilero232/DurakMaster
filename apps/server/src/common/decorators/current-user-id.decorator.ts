import type { ExecutionContext } from '@nestjs/common';

import { createParamDecorator } from '@nestjs/common';

import type { AuthedRequest } from '../guards';

import { AppUnauthorizedException } from '../exceptions';

export const CurrentUserId = createParamDecorator(
  (_data: unknown, context: ExecutionContext): string => {
    const { userId } = context.switchToHttp().getRequest<AuthedRequest>();

    if (!userId) {
      throw new AppUnauthorizedException('UNAUTHORIZED', 'Authentication required');
    }

    return userId;
  }
);
