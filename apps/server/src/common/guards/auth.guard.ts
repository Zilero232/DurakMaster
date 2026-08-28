import type { CanActivate, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';

import { Injectable } from '@nestjs/common';

import { AuthService } from '../../lib/auth/auth.service';
import { AppUnauthorizedException } from '../exceptions';

export type AuthedRequest = Request & { userId?: string };

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly auth: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthedRequest>();

    const headers = new Headers();

    for (const [name, value] of Object.entries(request.headers)) {
      if (typeof value === 'string') {
        headers.set(name, value);
      }
    }

    const userId = await this.auth.resolveUserId(headers);

    if (!userId) {
      throw new AppUnauthorizedException('UNAUTHORIZED', 'Authentication required');
    }

    request.userId = userId;

    return true;
  }
}
